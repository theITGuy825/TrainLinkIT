import React, { useState } from "react";
import { Link } from "react-router-dom";
import PostFeed from "../PostFeed/PostFeed";
import './Home.css';  // Make sure the CSS file is imported

function Home() {
  const [posts, setPosts] = useState([
    { id: 1, author: "Farouk Afolabi", content: "This is my first post!" },
    { id: 2, author: "Ethan Henderson", content: "Loving this platform! It was my idea." },
    { id: 3, author: "Muhammed Ahsan", content: "I am in charge of the backend stuff." }
  ]);

  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim() !== "") {
      const post = {
        id: posts.length + 1,
        author: "Farouk Afolabi", // Replace with actual logged-in user
        content: newPost,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>My App</h3>
        <nav>
          <Link to="/jobs">Job Board</Link>
          <Link to="/trainings">Trainings</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/profile">My Profile</Link>
        </nav>
      </div>

      {/* Main Content (Posts feed) */}
      <div className="main-content">
        <h2>Home - Feed</h2>

        {/* Create a Post */}
        <div>
          <textarea
            className="textarea"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <button className="post-button" onClick={handlePostSubmit}>Post</button>
        </div>

        {/* Display Posts */}
        <PostFeed posts={posts} title="All Posts" />
      </div>
    </div>
  );
}

export default Home;
