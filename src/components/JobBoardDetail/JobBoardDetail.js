import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import "./JobBoardDetail.css";
import Sidebar from "../Sidebar/sidebar.js";


const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  return timestamp.toDate().toLocaleString();
};

const JobBoardDetail = () => {
  const { jobId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false); // Track if the job is accepted
  const user = auth.currentUser;

  useEffect(() => {
    if (!jobId) return;

    const postRef = doc(db, "posts", jobId);
    const unsubscribePost = onSnapshot(postRef, async (docSnap) => {
      if (docSnap.exists()) {
        const postData = docSnap.data();

        const userRef = doc(db, "users", postData.userId);
        const userSnap = await getDoc(userRef);

        setPost({
          id: docSnap.id,
          author: userSnap.exists()
            ? `${userSnap.data().firstName} ${userSnap.data().lastName}`
            : "Unknown",
          userProfilePic: userSnap.exists() ? userSnap.data().userProfilePic : "/profilepic.png",
          ...postData,
        });
      }
    });

    return () => unsubscribePost();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;

    const commentsRef = collection(db, "posts", jobId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeComments();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;

    const likesRef = collection(db, "posts", jobId, "likes");
    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.size);
      setIsLiked(snapshot.docs.some((doc) => doc.id === user?.uid));
    });

    return () => unsubscribeLikes();
  }, [jobId, user]);

  const handleAddComment = async () => {
    if (!user || comment.trim() === "") return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.error("User document not found");
        return;
      }

      const userData = userSnap.data();
      const userName = `${userData.firstName} ${userData.lastName}`;
      const userProfilePic = userData.userProfilePic || "/profilepic.png";

      await addDoc(collection(db, "posts", jobId, "comments"), {
        text: comment,
        userId: user.uid,
        userName,
        userProfilePic,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, "posts", jobId), { commentsCount: increment(1) });

      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }

    const likeRef = doc(db, "posts", jobId, "likes", user.uid);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, { userId: user.uid });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleAcceptJob = async () => {
    if (!user) {
      alert("You must be logged in to accept a job.");
      return;
    }

    try {
      await updateDoc(doc(db, "posts", jobId), { acceptedBy: user.uid });
      setIsAccepted(true);
      alert("You have accepted this job!");
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  };

  return (
    <div className="post-detail-container-jobDetails">
      <Sidebar />
      {post ? (
        <div className="post-detail-jobDetails">
          <div className="post-header-jobDetails">
            <Link to={`/profile/${post.userId}`} className="author-info-jobDetails">
              <img
                src={post.userProfilePic}
                alt="Profile"
                className="profilepic-jobDetails"
                width="50"
                height="50"
                onError={(e) => (e.target.src = "/profilepic.png")}
              />
              <div>
                <h2>{post.author}</h2>
                <p className="post-meta-jobDetails">Posted on: {formatDate(post.timestamp)}</p>
              </div>
            </Link>
          </div>
          <p className="post-content-jobDetails">{post.content}</p>
          <div className="post-actions-jobDetails">
            <button onClick={handleShare}>🔗 Share</button>
          </div>
          <div className="comments-section-jobDetails">
            <h5>Comments</h5>
            {comments.length > 0 ? (
              comments.map((cmt) => (
                <div key={cmt.id} className="comment-jobDetails">
                  <img
                    src={cmt.userProfilePic}
                    alt="User"
                    className="comment-pic-jobDetails"
                    width="40"
                    height="40"
                  />
                  <div>
                    <strong>{cmt.userName}</strong>
                    <p className="post-content-jobDetails">{cmt.text}</p>
                    <p className="comment-meta-jobDetails">Posted on: {formatDate(cmt.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
            {user && (
              <div className="comment-input-jobDetails">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={handleAddComment}>Post</button>
              </div>
            )}
          </div>
          {!isAccepted && (
            <div className="accept-job-container-jobDetails">
              <button className="accept-job-button-large-jobDetails" onClick={handleAcceptJob}>
                Accept Job
              </button>
            </div>
          )}
          {isAccepted && <p className="accepted-message-jobDetails">You have accepted this job!</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default JobBoardDetail;