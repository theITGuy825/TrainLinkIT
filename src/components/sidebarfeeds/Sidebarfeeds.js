import React from "react";
import { Link } from "react-router-dom";
import './Sidebarfeeds.css';  // Make sure you create a CSS file for Sidebar styles

function Sidebarfeeds() {
  return (
    <div className="sidebarfeeds">
      <h3>My App</h3>
      <nav>
        <h1>LinkNews</h1>
        <h1>Suggested Friends</h1>
        <h1>Suggested Projects</h1>
        <h1>Sugested Trainings</h1>
      </nav>
    </div>
  );
}

export default Sidebarfeeds;
