import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDocs, // Import getDocs here
} from "firebase/firestore";

// Comment Popup component
function CommentPopup({ post, closePopup }) {
  const [newComment, setNewComment] = useState("");
  
  const handleCommentSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      const commentData = {
        userId: user.uid,
        content: newComment,
        timestamp: serverTimestamp(),
      };

      const commentRef = collection(db, "posts", post.id, "comments");
      await addDoc(commentRef, commentData);
      setNewComment(""); // Clear the input
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button onClick={closePopup}>Close</button>
        <h2>Comments for Post: {post.author}</h2>
        <p>{post.content}</p>

        {/* Render Comments */}
        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p><strong>{comment.author}</strong>: {comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>

        {/* Comment Form */}
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Post Comment</button>
      </div>
    </div>
  );
}

function PostFeed({ title, userId }) {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("/profilepic.png"); // Default placeholder
  const [selectedPost, setSelectedPost] = useState(null); // Track selected post for comments popup
  const [isPopupVisible, setPopupVisible] = useState(false); // Manage popup visibility

  // Fetch user data (including profile picture)
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const fullName = `${userData.firstName} ${userData.lastName}`;
        const profilePic = userData.profilePic || "/profilepic.png"; // Default to placeholder if not set
        return { fullName, profilePic }; // Return both full name and profile picture
      } else {
        return { fullName: "Anonymous", profilePic: "/profilepic.png" }; // Default values
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return { fullName: "Anonymous", profilePic: "/profilepic.png" }; // Default values on error
    }
  };

  // Fetch posts from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const { fullName, profilePic } = await getUserData(postData.userId); // Fetch both name and profile pic
          
          // Fetch the comments for this post
          const postCommentsSnapshot = await getDocs(collection(db, "posts", doc.id, "comments"));
          const comments = postCommentsSnapshot.docs.map((commentDoc) => commentDoc.data());
          
          return { id: doc.id, author: fullName, profilePic, comments, ...postData };
        })
      );
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, []);

  // Handle new post submission
  const handlePostSubmit = async () => {
    if (newPost.trim() !== "") {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to post.");
        return;
      }

      try {
        const newPostData = {
          userId: user.uid,
          content: newPost,
          timestamp: serverTimestamp(),
          likesCount: 0, // Initialize like count
          commentsCount: 0, // Placeholder for future comments
        };

        await addDoc(collection(db, "posts"), newPostData);
        setNewPost("");
      } catch (error) {
        console.error("Error adding post:", error);
      }
    }
  };

  // Handle Like button click
  const handleLike = async (postId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }

    const likeRef = doc(db, "posts", postId, "likes", user.uid);
    const postRef = doc(db, "posts", postId);

    try {
      const likeDoc = await getDoc(likeRef);
      if (likeDoc.exists()) {
        // Unlike: Remove like document and decrement count
        await deleteDoc(likeRef);
        await updateDoc(postRef, {
          likesCount: (await getDoc(postRef)).data().likesCount - 1,
        });
      } else {
        // Like: Add like document and increment count
        await setDoc(likeRef, { userId: user.uid });
        await updateDoc(postRef, {
          likesCount: (await getDoc(postRef)).data().likesCount + 1,
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle opening the comment popup
  const openCommentPopup = (post) => {
    setSelectedPost(post);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedPost(null);
  };

  return (
    <div>
      <h2>{title}</h2>

      {/* Create a Post */}
      <div className="post-creation">
        <div className="post-creation-header">
          {/* Display the current user's profile picture */}
          <img
            src={userProfilePic}
            alt="Your Profile"
            width="50"
            height="50"
            className="profilepic-post-creation"
          />
          <textarea
            className="textarea"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
        </div>
        <button className="post-button" onClick={handlePostSubmit}>
          Post
        </button>
      </div>

      {/* Display Posts */}
      <div className="post-feed-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img
                  src={post.profilePic}
                  alt="Profile"
                  width="50"
                  height="50"
                  className="profilepic"
                />
                <h4>{post.author}</h4> {/* Display full name */}
              </div>
              <p>{post.content}</p>

              {/* Like & Comment Counters */}
              <div className="post-actions">
                <button className="toolie" onClick={() => handleLike(post.id)}>
                  ❤️ {post.likesCount} Likes
                </button>
                <button className="toolie" onClick={() => openCommentPopup(post)}>
                  💬 {post.commentsCount} Comments
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* Show the comment popup if visible */}
      {isPopupVisible && <CommentPopup post={selectedPost} closePopup={closePopup} />}
    </div>
  );
}

export default PostFeed;
