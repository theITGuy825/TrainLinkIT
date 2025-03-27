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
import Sidebar from "../Sidebar/sidebar";
import "../Sidebar/Sidebar.css";
import "./JobBoard.css";


function JobBoard({ title }) {
  const [newPost, setNewPost] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [link, setLink] = useState("");
  const [posts, setPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("/profilepic.png");
  const [userFullName, setUserFullName] = useState("Anonymous");

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
          const { fullName, profilePic } = await getUserData(postData.userId);

          // Filter out posts with empty or missing fields
          if (
            !postData.title?.trim() ||
            !postData.description?.trim() ||
            !postData.difficulty?.trim() ||
            !postData.language?.trim() ||
            !postData.link?.trim()
          ) {
            return null; // Exclude invalid posts
          }

          return { id: doc.id, author: fullName, profilePic, ...postData };
        })
      );

      // Remove null values from the posts array
      setPosts(postsArray.filter((post) => post !== null));
    });

    fetchUserData();
    return () => unsubscribe();
  }, []);

  // Handle new post submission
  const handlePostSubmit = async () => {
    if (newPost.trim() !== "" && description.trim() !== "" && difficulty.trim() !== "" && language.trim() !== "" && link.trim() !== "") {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to post.");
        return;
      }

      try {
        const newPostData = {
          userId: user.uid,
          title: newPost,
          description,
          difficulty,
          language,
          link,
          timestamp: serverTimestamp(),
          likesCount: 0,
          commentsCount: 0,
        };

        await addDoc(collection(db, "posts"), newPostData);
        setNewPost("");
        setDescription("");
        setDifficulty("");
        setLanguage("");
        setLink("");
      } catch (error) {
        console.error("Error adding post:", error);
      }
    } else {
      alert("Please fill out all fields.");
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
    
    <div className="jobboard-container">
      {/* Sidebar */}
     
        <Sidebar />


      {/* JobBoard Content */}
      <div className="jobboard-content">
        <h1 className="jobboard-header" >JOB POSTING</h1>
        <h2>{title}</h2>

        {/* Create a Post */}
        <div className="post-creation">
          <div className="post-creation-header">
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
            placeholder="Job Title"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <br />
          <textarea
            className="textarea"
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <select
            className="select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="" disabled>
              Select Difficulty
            </option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <br />
          <select
            className="select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="" disabled>
              Select Language
            </option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="Ruby">Ruby</option>
          </select>
          <br />
          <input
            className="input"
            placeholder="Job Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <br />
          <button className="post-button" onClick={handlePostSubmit}>
            Post Job
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
                  <h4>{post.author}</h4>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p>
                  <strong>Difficulty:</strong> {post.difficulty}
                </p>
                <p>
                  <strong>Language:</strong> {post.language}
                </p>
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobBoard;