import React, { useState } from "react"; // Import useState from React
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation
import "./Sidebarfeeds.css"; // Import the CSS file for Sidebar styles
import Following from "./Following";
import Followers from "./Followers";
// Importing icons from React Icons
import {
  FaLink,
  FaUserFriends,
  FaChalkboardTeacher,
  FaRegHandshake,
  FaUserCheck,
} from "react-icons/fa";

function Sidebarfeeds() {
  const [selectedSection, setSelectedSection] = useState("following");
  const [activeItem, setActiveItem] = useState(null); // Track active item in the sidebar

  const handleItemClick = (index) => {
    setActiveItem(activeItem === index ? null : index); // Toggle active state on click
  };

  // Sidebar menu items with title, icon, and link
  const menuItems = [
    { title: "LinkNews", icon: <FaLink /> },
    { title: "Suggested Friends", icon: <FaUserFriends /> },
    { title: "Trainings", icon: <FaChalkboardTeacher /> },
  ];

  return (
    <div className="sidebarfeeds">
      <h3 className="my-app">Updates</h3>

      <nav className="title-nav">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            onClick={() => handleItemClick(index)} // Toggle active item on click
            className={activeItem === index ? "active" : ""} // Add active class if the item is active
          >
            <span className="iconRender">{item.icon}</span> {/* Render the icon */}
            <span className="textRender">{item.title}</span> {/* Render the title */}
          </Link>
        ))}
      </nav>

      <div className="friends">
        <button
          className={selectedSection === "followers" ? "active-btn" : ""}
          onClick={() => setSelectedSection("followers")}
        >
          <FaUserCheck />Followers
        </button>
        <button
          className={selectedSection === "following" ? "active-btn" : ""}
          onClick={() => setSelectedSection("following")}
        >
          <FaRegHandshake />Following
        </button>
      </div>

      {/* Conditionally render Following or Followers */}
      <div className="follow-section">
        {selectedSection === "following" ? <Following /> : <Followers />}
      </div>
    </div>
  );
}

export default Sidebarfeeds;
