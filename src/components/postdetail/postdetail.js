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

function formatDate(timestamp) {
  if (!timestamp) return "Unknown";
  const date = timestamp.toDate(); // Convert Firestore Timestamp
  return date.toLocaleString(); // Formats into readable date & time
}

function PostDetail() {
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
    const unsubscribePost = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setPost({ id: docSnap.id, ...postData });
        setLikes(postData.likes || 0);
      } else {
        console.log("Post not found");
      }
    });

    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc"));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [postId]);

  useEffect(() => {
    if (!user || !postId) return;

    const likeRef = doc(db, "posts", postId, "likes", user.uid);
    getDoc(likeRef).then((docSnap) => {
      setIsLiked(docSnap.exists());
    });
  }, [user, postId]);

  const handleAddComment = async () => {
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }
    if (comment.trim() === "") return;
  
    const commentData = {
      text: comment,
      userId: user.uid,
      userName: user.displayName || "Anonymous", // Store username
      userProfilePic: user.photoURL || "/profilepic.png",
      timestamp: serverTimestamp(),
    };
  
    try {
      // Add the comment to the comments subcollection
      await addDoc(collection(db, "posts", postId, "comments"), commentData);
  
      // Update the comments count in the post document
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        commentsCount: increment(1), // Increment the comments count
      });
  
      setComment(""); // Clear the input field after posting the comment
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
    const postRef = doc(db, "posts", postId);

    if (isLiked) {
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likes: likes - 1 });
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      await setDoc(likeRef, { userId: user.uid });
      await updateDoc(postRef, { likes: likes + 1 });
      setIsLiked(true);
      setLikes(likes + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  };

  return (
    <div className="post-detail-container">
      {post ? (
        <div className="post-detail">
          <div className="post-header">
            <Link to={`/profile/${post.userId}`} className="author-info">
              <img
                src={post.profilePic || "/profilepic.png"}
                alt="Profile"
                width="50"
                height="50"
                className="profilepic"
              />
              <div>
                <h2>{post.author || "Unknown"}</h2>
                <p className="post-meta">Posted on: {post.timestamp ? formatDate(post.timestamp) : "Unknown"}</p>
              </div>
            </Link>
          </div>
          <p className="post-content">{post.content}</p>

          {/* Like and Share Buttons */}
          <div className="post-actions">
            <button className={isLiked ? "liked" : ""} onClick={handleLike}>
              ❤️ {likes}
            </button>
            <button onClick={handleShare}>🔗 Share</button>
          </div>

          {/* Comment Section */}
          <div className="comments-section">
            <h5>Comments</h5>
            {comments.length > 0 ? (
            comments.map((cmt) => (
              <div key={cmt.id} className="comment">
                <img 
                  src={cmt.userProfilePic || "/profilepic.png"} 
                  alt="User" 
                  className="comment-pic" 
                  width="40" 
                  height="40"
                />
                <div>
                  <strong>{cmt.userName || "Unknown User"}</strong> {/* Ensure username appears */}
                  <p>{cmt.text}</p>
                  <p className="comment-meta">
                    Posted on: {cmt.timestamp ? formatDate(cmt.timestamp) : "Unknown"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}

            {user && (
              <div className="comment-input">
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PostDetail;
