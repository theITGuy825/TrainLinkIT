import React from "react";
import PostFeed from "../PostFeed/PostFeed.js";  // Import the PostFeed component
import Sidebar from "../Sidebar/sidebar.js";
import Sidebarfeeds from "../sidebarfeeds/Sidebarfeeds.js";
import './Home.css'; 
import '../Sidebar/Sidebar.css';
import '../sidebarfeeds/Sidebarfeeds.css';
import '../PostFeed/PostFeed.css';  

function Home() {
  return (
    <div className="home-container">
      {/* Sidebar component */}
      <Sidebar />

      {/* Main Content (Posts feed) */}
      <div className="main-content">
      
        {/* PostFeed component handles both the posts and post creation */}
        <PostFeed/>
        <Sidebarfeeds  className="sidebar-right"/>
      </div>
    </div>
  );
}

export default Home;
