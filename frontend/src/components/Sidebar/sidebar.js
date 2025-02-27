import React from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';  // Make sure you create a CSS file for Sidebar styles

function Sidebar() {
  return (
    <div className="sidebar">
      <img src='/image073263.png' alt="description" width="300" height="300" className='logo'/>

      <nav>
        <Link to="/home">Home</Link>
        <Link to="/jobs">Job Board</Link>
        <Link to="/trainings">Trainings</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/profile">My Profile</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
