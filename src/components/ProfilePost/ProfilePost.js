import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  getDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import './ProfilePost.css';

function ProfilePost({ profileUserId }) {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Get current user ID
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch user full name
  const getUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() ? `${userDoc.data().firstName} ${userDoc.data().lastName}` : "Anonymous";
    } catch (error) {
      console.error("Error fetching user:", error);
      return "Anonymous";
    }
  };

  // Fetch posts by the profile user ID
  useEffect(() => {
    if (!profileUserId) return;
  
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log("Fetched snapshot docs:", snapshot.docs); // Check if there are posts in the snapshot
  
      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          console.log("Post data:", postData); // Log post data to check if userId matches profileUserId
          
          if (postData.userId !== profileUserId) {
            console.log(`Skipping post from userId: ${postData.userId}`);
            return null; // Skip posts that don't match profileUserId
          }
  
          const fullName = await getUserName(postData.userId);
          return { id: doc.id, author: fullName, ...postData };
        })
      );
  
      const filteredPosts = postsArray.filter(Boolean);
      console.log("Filtered Posts:", filteredPosts); // Check filtered posts before setting state
      setPosts(filteredPosts);
    });
  
    return () => unsubscribe();
  }, [profileUserId]);
  

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((post) => post.id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  // Start editing a post
  const handleEditPost = (post) => {
    setEditingPostId(post.id);
    setEditingContent(post.content);
  };

  // Update post
  const handleUpdatePost = async (postId) => {
    try {
      await updateDoc(doc(db, "posts", postId), {
        content: editingContent,
      });
      setPosts(posts.map((post) => (post.id === postId ? { ...post, content: editingContent } : post)));
      setEditingPostId(null);
      setEditingContent("");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div>
      <h2>{profileUserId === userId ? "Your Posts" : "User's Posts"}</h2>
      <div className="post-feed-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src="/profilepic.png" alt="Profile" width="50" height="50" className="profilepic" />
                <h4>{post.author}</h4>
              </div>

              {editingPostId === post.id ? (
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <button onClick={() => handleUpdatePost(post.id)}>Save</button>
                  <button onClick={() => setEditingPostId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{post.content}</p>
                  <div className="post-actions">
                    {profileUserId === userId && (
                      <>
                        <button className="edit-button" onClick={() => handleEditPost(post)}>
                          ✏️ Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDeletePost(post.id)}>
                          🗑 Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePost;
