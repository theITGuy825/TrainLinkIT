import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Home - Feed</h2>
      <nav>
        <Link to="/jobs">Job Board</Link> | 
        <Link to="/trainings">Trainings</Link> | 
        <Link to="/blog">Blog</Link> | 
        <Link to="/profile">My Profile</Link>
      </nav>
      <input type="text" placeholder="Search users..." />
      <div>
        <h3>Feed of Followed Profiles</h3>
        {/* List of followed users' posts */}
      </div>
    </div>
  );
};

export default Home;