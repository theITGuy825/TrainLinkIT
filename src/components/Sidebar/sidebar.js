import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Make sure you create a CSS file for Sidebar styles
import {
  FaHome,
  FaBriefcase,
  FaChalkboardTeacher,
  FaBlog,
  FaUser,
} from "react-icons/fa";
import { auth } from "../../firebase";

function Sidebar() {
  const userId = auth.currentUser?.uid; // Get the userId from Firebase

  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (index) => {
    setActiveItem(activeItem === index ? null : index);
  };

  const menuItems = [
    { title: "Home", icon: <FaHome />, link: "/home" },
    { title: "Job Board", icon: <FaBriefcase />, link: "/jobs" },
    { title: "Trainings", icon: <FaChalkboardTeacher />, link: "/trainings" },
    { title: "Blog", icon: <FaBlog />, link: "/blog" },
    {
      title: "My Profile",
      icon: <FaUser />,
      link: userId ? `/profile/${userId}` : "/login",
    },
  ];

  return (
    <div className="sidebar">
      <img
        src="/image073263.png"
        alt="description"
        width="200"
        height="200"
        className="logoSidebar"
      />

      <nav className="title-nav">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            onClick={() => handleItemClick(index)}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <nav className="icon-nav">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menu-item ${activeItem === index ? "active" : ""}`}
            onClick={() => handleItemClick(index)}
          >
            <Link to={item.link}>
              <div className="icon">{item.icon}</div>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
