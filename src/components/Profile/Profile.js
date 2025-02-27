import React from "react";
import Sidebar from "../Sidebar/sidebar.js";
import PostFeed from "../PostFeed/PostFeed.js";
import '../Sidebar/Sidebar.css';
import '../Postfeed/Postfeed.css';
import './Profile.css';

function Profile() {
  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h2>My Profile</h2>
        <PostFeed />
      </div>
    </div>
  );
}


export default Profile;
