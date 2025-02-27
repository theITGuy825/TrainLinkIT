import React, { useState, useEffect } from "react";
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
} from "firebase/firestore";

function PostFeed({ title }) {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);

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

  // Fetch posts from Firestore in real time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const fullName = await getUserName(postData.userId);
          return { id: doc.id, author: fullName, ...postData };
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

  return (
    <div>
      <h2>{title}</h2>

      {/* Create a Post */}
      <div className="post-creation">
        <textarea
          className="textarea"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
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
                <img src="/profilepic.png" alt="Profile" width="50" height="50" className="profilepic" />
                <h4>{post.author}</h4>
              </div>
              <p>{post.content}</p>

              {/* Like & Comment Counters */}
              <div className="post-actions">
                <button className="toolie" onClick={() => handleLike(post.id)}>
                  ❤️ {post.likesCount} Likes
                </button>
                <button className="toolie">💬 {post.commentsCount} Comments</button>
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
