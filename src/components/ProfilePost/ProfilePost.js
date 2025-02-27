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

function ProfilePost() {
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

  // Fetch only the logged-in user's posts
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          if (postData.userId !== userId) return null;
          const fullName = await getUserName(postData.userId);
          return { id: doc.id, author: fullName, ...postData };
        })
      );

      setPosts(postsArray.filter(Boolean));
    });

    return () => unsubscribe();
  }, [userId]);

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
      <h2>Your Posts</h2>
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
                    <button className="edit-button" onClick={() => handleEditPost(post)}>
                      ✏️ Edit
                    </button>
                    <button className="delete-button" onClick={() => handleDeletePost(post.id)}>
                      🗑 Delete
                    </button>
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
