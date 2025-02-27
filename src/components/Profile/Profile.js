import React from "react";
import Sidebar from "../Sidebar/sidebar.js";
import ProfilePost from "../ProfilePost/ProfilePost.js";
import '../Sidebar/Sidebar.css';
import '../ProfilePost/ProfilePost.css';
import './Profile.css';

function Profile() {
  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h2>My Profile</h2>
        <ProfilePost />
      </div>
    </div>
  );
}


export default Profile;
