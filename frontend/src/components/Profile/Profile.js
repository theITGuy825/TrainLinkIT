import React, { useState } from "react";
import PostFeed from "../PostFeed/PostFeed";
import Sidebar from "../Sidebar/sidebar.js";
import '../Sidebar/Sidebar.css';

function Profile ({ posts = [] }) {
    const myPosts = posts?.filter((post) => post.author === "Farouk Afolabi"); // Replace with actual user check

  return (
    
    <div>
      <Sidebar />

      <h2>My Profile</h2>
      <h3>My Posts</h3>
       {/* Use PostFeed component instead of manually mapping posts */}
       <PostFeed posts={posts} title="Your Posts" />
    </div>
  );
};

export default Profile;
