import React, { useState } from "react"; // Import useState from React
import { Link } from "react-router-dom"; // Import Link from react-router-dom for navigation
import "./Sidebarfeeds.css"; // Import the CSS file for Sidebar styles
// Importing icons from React Icons
import {
  FaLink,
  FaUserFriends,
  FaBriefcase,
  FaChalkboardTeacher,
  FaRegHandshake,
  FaUserCheck,
} from "react-icons/fa";

function Sidebarfeeds() {
  const [activeItem, setActiveItem] = useState(null); // Track active item in the sidebar

  const handleItemClick = (index) => {
    setActiveItem(activeItem === index ? null : index); // Toggle active state on click
  };

  // Sidebar menu items with title, icon, and link
  const menuItems = [
    { title: "LinkNews", icon: <FaLink /> },
    { title: "Suggested Friends", icon: <FaUserFriends /> },
    { title: "Trainings", icon: <FaChalkboardTeacher /> },
    { title: "Following", icon: <FaUserCheck /> },
    { title: "Followers", icon: <FaRegHandshake /> },
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
            <span>{item.icon}</span> {/* Render the icon */}
            {item.title} {/* Render the title */}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebarfeeds;
