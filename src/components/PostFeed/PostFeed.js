import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  increment,
} from "firebase/firestore";

function PostFeed({ title }) {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("/profilepic.png");

  // Fetch user data (including profile picture)
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          fullName: `${userData.firstName} ${userData.lastName}`,
          profilePic: userData.profilePic || "/profilepic.png",
        };
      }
      return { fullName: "Anonymous", profilePic: "/profilepic.png" };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { fullName: "Anonymous", profilePic: "/profilepic.png" };
    }
  };

  // Fetch posts from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const { fullName, profilePic } = await getUserData(postData.userId);
          return { id: doc.id, author: fullName, profilePic, ...postData };
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
          likesCount: 0,
          commentsCount: 0,
        };

        await addDoc(collection(db, "posts"), newPostData);
        setNewPost("");
      } catch (error) {
        console.error("Error adding post:", error);
      }
    }
  };

  // Handle like button click
  const handleLike = async (postId) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likesCount: increment(1), // Increment the like count
    });
  };

  // Handle comment button click (redirects to post comments page)
  const handleComment = (postId) => {
    // Optional: Perform additional actions like scrolling to the comment section, etc.
  };

  return (
    <div>
      <h2>{title}</h2>
      {/* Create a Post */}
      <div className="post-creation">
        <div className="post-creation-header">
          <img src={userProfilePic} alt="Your Profile" width="50" height="50" className="profilepic-post-creation" />
          <textarea className="textarea" placeholder="What's on your mind?" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
        </div>
        <button className="post-button" onClick={handlePostSubmit}>Post</button>
      </div>
      {/* Display Posts */}
      <div className="post-feed-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <Link to={`/profile/${post.userId}`} className="post-link">
                <div className="post-header">
                  <img src={post.profilePic} alt="Profile" width="50" height="50" className="profilepic" />
                  <h4>{post.author}</h4>
                </div>
              </Link>
              <Link to={`/post/${post.id}`} className="post-link">
                <p>{post.content}</p>
              </Link>

              <div className="post-actions">
                <button className="like-button" onClick={() => handleLike(post.id)}>👍 Like ({post.likesCount})</button>
                <Link to={`/post/${post.id}`} className="toolie">💬 View Comments ({post.commentsCount})</Link>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default PostFeed;
