import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
  collection,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "./ProfilePost.css";

function ProfilePost() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

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
    let isMounted = true;
    if (!userId) return;

    const q = query(collection(db, "posts"), where("userId", "==", userId), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!isMounted) return;

      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const fullName = await getUserName(postData.userId);
          return { id: doc.id, author: fullName, ...postData };
        })
      );

      setPosts(postsArray);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId]);

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  // Start editing a post
  const handleEditPost = (post) => {
    setEditingPost({ id: post.id, content: post.content });
  };

  // Update post
  const handleUpdatePost = async () => {
    if (!editingPost?.content.trim()) return;

    try {
      await updateDoc(doc(db, "posts", editingPost.id), {
        content: editingPost.content,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.id ? { ...post, content: editingPost.content } : post
        )
      );
      setEditingPost(null);
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

              {editingPost?.id === post.id ? (
                <div>
                  <textarea
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  />
                  <button onClick={handleUpdatePost}>Save</button>
                  <button onClick={() => setEditingPost(null)}>Cancel</button>
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