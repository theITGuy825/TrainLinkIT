import React, { useState } from "react";
import Sidebar from "../Sidebar/sidebar.js";
import ProfilePost from "../ProfilePost/ProfilePost.js";
import LikedPosts from "../LikedPost/LikedPost.js"; // Import LikedPosts
import '../Sidebar/Sidebar.css';
import '../ProfilePost/ProfilePost.css';
import './Profile.css';

function Profile() {
  const [view, setView] = useState("myPosts"); // State to manage view

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h2>My Profile</h2>
        <div className="profile-buttons">
          <button onClick={() => setView("myPosts")}>My Posts</button>
          <button onClick={() => setView("likedPosts")}>Liked Posts</button>
        </div>
        {view === "myPosts" ? <ProfilePost /> : <LikedPosts />}
      </div>
    </div>
  );
}

export default Profile;
