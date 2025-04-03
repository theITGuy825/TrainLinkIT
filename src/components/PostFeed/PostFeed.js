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
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { FaHeart, FaComment } from "react-icons/fa";

function PostFeed({ title }) {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("/profilepic.png");
  const [userFullName, setUserFullName] = useState("Anonymous");

  // Fetch user data (including profile picture and business name)
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const fullName =
          userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.businessName || "Anonymous";

        return {
          fullName,
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
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const { fullName, profilePic } = await getUserData(user.uid);
        setUserFullName(fullName);
        setUserProfilePic(profilePic);
      }
    };

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsArray = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          if (!postData.content) return null; // Only include posts that have content

          const { fullName, profilePic } = await getUserData(postData.userId);
          return {
            id: doc.id,
            author: fullName,
            profilePic,
            content: postData.content,
            likesCount: postData.likesCount || 0,
            commentsCount: postData.commentsCount || 0,
            timestamp: postData.timestamp,
            userId: postData.userId,
          };
        })
      );
      setPosts(postsArray.filter((post) => post !== null));
    });

    fetchUserData();
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
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        console.error("Post does not exist");
        return;
      }

      if (likeDoc.exists()) {
        // User already liked, so remove like
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likesCount: increment(-1) });
      } else {
        // User has not liked, so add like
        await setDoc(likeRef, { userId: user.uid });
        await updateDoc(postRef, { likesCount: increment(1) });
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      {/* Create a Post */}
      <div className="post-creation">
        <div className="post-creation-header">
          <div className="post-creation-header-second">
            <img
              src={userProfilePic}
              alt="Your Profile"
              width="50"
              height="50"
              className="profilepic-post-creation"
            />
            <h2 className="user-full-name">{userFullName}</h2>
          </div>
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
              <Link to={`/profile/${post.userId}`} className="post-link">
                <div className="post-header">
                  <img
                    src={post.profilePic}
                    alt="Profile"
                    width="50"
                    height="50"
                    className="profilepic"
                  />
                  <h4>{post.author}</h4>
                </div>
              </Link>
              <Link to={`/post/${post.id}`} className="post-link">
                <p>{post.content}</p>
              </Link>

              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(post.id)}
                >
                  <FaHeart /> <span className="like-edit"> Like </span>(
                  {post.likesCount})
                </button>
                <Link to={`/post/${post.id}`} className="toolie">
                  <FaComment />{" "}
                  <span className="comment-edit">View Comments</span> (
                  {post.commentsCount})
                </Link>
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
