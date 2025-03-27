import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase"; // Ensure you import the db instance
import { collection, getDocs } from "firebase/firestore"; // Firestore query imports
import "./Sidebar.css";
import {
  FaStore,
  FaHome,
  FaBriefcase,
  FaChalkboardTeacher,
  FaBlog,
  FaUser,
} from "react-icons/fa";
import { auth } from "../../firebase";

function Sidebar() {
  const userId = auth.currentUser?.uid;
  const [activeItem, setActiveItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [users, setUsers] = useState([]); // State for storing users
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users based on search

  const handleItemClick = (index) => {
    setActiveItem(activeItem === index ? null : index);
  };

  useEffect(() => {
    // Fetch all users when component mounts
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users"); // Reference to the "users" collection
        const querySnapshot = await getDocs(usersRef); // Get all users

        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Assuming each user document has an ID
          ...doc.data(),
        }));
        setUsers(userList);
        setFilteredUsers(userList); // Initially show all users
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on the search query
    if (searchQuery === "") {
      setFilteredUsers(users); // If no search query, show all users
    } else {
      setFilteredUsers(
        users.filter((user) => {
          // Combine first and last name for matching
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
          const businessName = user.businessName?.toLowerCase() || "";
          return (
            fullName.includes(searchQuery.toLowerCase()) ||
            businessName.includes(searchQuery.toLowerCase())
          );
        })
      );
    }
  }, [searchQuery, users]);

  const menuItems = [
    { title: "Home", icon: <FaHome />, link: "/home" },
    { title: "Job Board", icon: <FaBriefcase />, link: "/jobs" },
    { title: "Trainings", icon: <FaChalkboardTeacher />, link: "/trainings" },
    { title: "Messenger", icon: <FaBlog />, link: "/Messenger" },
    { title: "My Profile", icon: <FaUser />, link: userId ? `/profile/${userId}` : "/login"},
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

      <img src="/image173264.png" alt="description" className="smallLogo" />

      {/* Search box for users */}
      <input
        type="text"
        placeholder="Search users & businesses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-box"
      />

      <div className="search-results">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="search-result"
            >
              {user.businessName ? (
                <>
                  <FaStore /> {user.businessName}
                </>
              ) : (
                <>
                  <FaUser /> {user.firstName} {user.lastName}
                </>
              )}
            </Link>
          ))
        ) : (
          <p>err No users found</p>
        )}
      </div>
      
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
