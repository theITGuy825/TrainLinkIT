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
import { useParams } from "react-router-dom";
import "./ProfilePost.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function ProfilePost() {
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId: profileUserId } = useParams();

  // Get current user ID
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch user display name (checks for businessName if no firstName/lastName)
  const getUserDisplayName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) return "Anonymous";

      const userData = userDoc.data();

      // Check for business name if personal name doesn't exist
      if (userData.firstName && userData.lastName) {
        return `${userData.firstName} ${userData.lastName}`;
      } else if (userData.businessName) {
        return userData.businessName;
      }
      return "Anonymous";
    } catch (error) {
      console.error("Error fetching user:", error);
      return "Anonymous";
    }
  };

  // Fetch posts for the profile user
  useEffect(() => {
    let isMounted = true;
    if (!profileUserId) return;

    setLoading(true);
    setPosts([]);

    const q = query(
      collection(db, "posts"),
      where("userId", "==", profileUserId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (!isMounted) return;

      try {
        const postsArray = (
          await Promise.all(
            snapshot.docs.map(async (doc) => {
              const postData = doc.data();
              if (!postData.content) return null;

              const displayName = await getUserDisplayName(postData.userId);
              return {
                id: doc.id,
                author: displayName,
                content: postData.content,
                likesCount: postData.likesCount || 0,
                commentsCount: postData.commentsCount || 0,
                timestamp: postData.timestamp,
                userId: postData.userId,
              };
            })
          )
        ).filter(Boolean);

        if (isMounted) {
          setPosts(postsArray);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [profileUserId]);

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
          post.id === editingPost.id
            ? { ...post, content: editingPost.content }
            : post
        )
      );
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const isViewingOwnProfile = currentUserId === profileUserId;

  if (loading) {
    return (
      <div className="loading-container">
        <p>No Posts Found...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{isViewingOwnProfile ? "Your Posts" : "User's Posts"}</h2>
      <div className="post-feed-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                <img
                  src="/profilepic.png"
                  alt="Profile"
                  width="50"
                  height="50"
                  className="profilepic"
                />
                <h4>{post.author}</h4>
              </div>

              {editingPost?.id === post.id ? (
                <div className="textArea-editing">
                  <textarea
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content: e.target.value,
                      })
                    }
                  />
                  <div className="postSaveCancelbtn">
                    <button className="savePostEdit" onClick={handleUpdatePost}>
                      Save
                    </button>
                    <button
                      className="cancelPostEdit"
                      onClick={() => setEditingPost(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>{post.content}</p>
                  {isViewingOwnProfile && (
                    <div className="post-actions-profile">
                      <button
                        className="edit-button"
                        onClick={() => handleEditPost(post)}
                      >
                        <div className="edit-combined">
                          <FaEdit className="editing-icon" />{" "}
                          <span className="editing-btn">Edit</span>
                        </div>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <div className="delete-combined">
                          <FaTrash className="deleting-icon" />{" "}
                          <span className="deleting-btn">Delete</span>
                        </div>
                      </button>
                    </div>
                  )}
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
