import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";

function LikedPosts() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user ID
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch author's details (name & profile pic)
  const getAuthorData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          firstName: userData.firstName || "Unknown",
          lastName: userData.lastName || "User",
          profilePic: userData.profilePic || "/profilepic.png",
        };
      }
    } catch (error) {
      console.error("Error fetching author data:", error);
    }
    return { firstName: "Unknown", lastName: "User", profilePic: "/profilepic.png" };
  };

  // Fetch liked posts
  useEffect(() => {
    if (!userId) return;

    const userLikesRef = collection(db, "users", userId, "likes");

    const unsubscribe = onSnapshot(userLikesRef, async (snapshot) => {
      const postsArray = await Promise.all(
        snapshot.docs.map(async (likeDoc) => {
          const postId = likeDoc.id;
          const postRef = doc(db, "posts", postId);
          const postSnap = await getDoc(postRef);

          if (postSnap.exists()) {
            const postData = postSnap.data();
            const authorData = await getAuthorData(postData.userId); // Fetch original author details
            return {
              id: postId,
              content: postData.content,
              timestamp: postData.timestamp,
              ...authorData,
            };
          }
          return null;
        })
      );

      setLikedPosts(postsArray.filter((post) => post !== null));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (loading) return <p>Loading liked posts...</p>;

  return (
    <div>
      <h2>Liked Posts</h2>
      <div className="post-feed-container">
        {likedPosts.length > 0 ? (
          likedPosts.map((post) => (
            <div key={post.id} className="post">
              <div className="post-header">
                {/* Profile Picture */}
                <img
                  src={post.profilePic}
                  alt="Profile"
                  className="profile-pic"
                />
                {/* Author Name */}
                <h4>{post.firstName} {post.lastName}</h4>
              </div>
              {/* Post Content */}
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No liked posts available.</p>
        )}
      </div>
    </div>
  );
}

export default LikedPosts;
