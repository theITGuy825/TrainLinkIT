import React from "react";
import './Sidebarfeeds.css'; // Make sure you create a CSS file for Sidebar styles

// Importing icons from React Icons
import { FaLink, FaUserFriends, FaBriefcase, FaChalkboardTeacher } from 'react-icons/fa';

function Sidebarfeeds() {
  return (
    <div className="sidebarfeeds">
      <h3 className="my-app">Updates</h3>

      <nav className="title-nav">
        <h1>Link News</h1>
        <h1>Suggested Friends</h1>
        <h1>Suggested Projects</h1>
        <h1>Suggested Trainings</h1>
      </nav>
    
      <nav className="icon-nav">
        <div className="menu-item">
          <FaLink className="icon" />
        </div>
        <div className="menu-item">
          <FaUserFriends className="icon" />
        </div>
        <div className="menu-item">
          <FaBriefcase className="icon" />
        </div>
        <div className="menu-item">
          <FaChalkboardTeacher className="icon" />
        </div>
      </nav>
      
    </div>
  );
}

export default Sidebarfeeds;
