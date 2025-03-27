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
import "./PostDetail.css";
import Sidebar from "../Sidebar/sidebar.js";
import Sidebarfeeds from "../sidebarfeeds/Sidebarfeeds.js";

const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  return timestamp.toDate().toLocaleString();
};

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!postId) return;

    const postRef = doc(db, "posts", postId);
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
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeComments();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
  
    const likesRef = collection(db, "posts", postId, "likes");
    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.size); // Set likes count dynamically
      setIsLiked(snapshot.docs.some(doc => doc.id === user?.uid)); // Check if user liked it
    });
  
    return () => unsubscribeLikes();
  }, [postId, user]);
  

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
  
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: comment,
        userId: user.uid,
        userName,
        userProfilePic,
        timestamp: serverTimestamp(),
      });
  
      await updateDoc(doc(db, "posts", postId), { commentsCount: increment(1) });
  
      setComment(""); // Clear input after posting
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  const handleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }
  
    const likeRef = doc(db, "posts", postId, "likes", user.uid);
  
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
  

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  };

  return (
    
    <div className="post-detail-container">
      <Sidebar />
      {post ? (
        <div className="post-detail">
          <div className="post-header">
            <Link to={`/profile/${post.userId}`} className="author-info">
            <img src={post.userProfilePic} alt="Profile" className="profilepic" width="50" height="50" onError={(e) => (e.target.src = "/profilepic.png")} />

              <div>
                <h2>{post.author}</h2>
                <p className="post-meta">Posted on: {formatDate(post.timestamp)}</p>
              </div>
            </Link>
          </div>
          <p className="post-content">{post.content}</p>
          <div className="post-actions">
            <button className={isLiked ? "liked" : ""} onClick={handleLike}>❤️ {likes}</button>
            <button onClick={handleShare}>🔗 Share</button>
          </div>
          <div className="comments-section">
            <h5>Comments</h5>
            {comments.length > 0 ? (
              comments.map((cmt) => (
                <div key={cmt.id} className="comment">
                  <img src={cmt.userProfilePic} alt="User" className="comment-pic" width="40" height="40" />
                  <div>
                    <strong>{cmt.userName}</strong>
                    <p className="post-content">{cmt.text}</p>
                    <p className="comment-meta">Posted on: {formatDate(cmt.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
            {user && (
              <div className="comment-input">
                <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
                <button onClick={handleAddComment}>Post</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
       <Sidebarfeeds  className="sidebar-right"/>
    </div>
  );
};

export default PostDetail;
