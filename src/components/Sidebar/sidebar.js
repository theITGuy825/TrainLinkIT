import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Sidebar.css";
import {
  FaStore,
  FaHome,
  FaBriefcase,
  FaChalkboardTeacher,
  FaBlog,
  FaUser,
  FaSchool,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { auth } from "../../firebase";

function Sidebar() {
  const userId = auth.currentUser?.uid;
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1000) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(
        users.filter((user) => {
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

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const handleSearchFocus = () => setShowSearchResults(true);
  const handleSearchBlur = () => setTimeout(() => setShowSearchResults(false), 200);

  const menuItems = [
    { title: "Home", icon: <FaHome />, link: "/home" },
    { title: "Job Board", icon: <FaBriefcase />, link: "/jobs" },
    { title: "Trainings", icon: <FaChalkboardTeacher />, link: "/trainings" },
    { title: "Messenger", icon: <FaBlog />, link: "/Messenger" },
    { title: "My Profile", icon: <FaUser />, link: userId ? `/profile/${userId}` : "/login"},
    { title: "Code Help", icon: <FaSchool/>, link: "https://discord.com/invite/code", target: "_blank" },
  ];

  const showHamburger = windowWidth <= 1000;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {showHamburger && (
        <button 
          className="hamburger-btn"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
      )}

      {(!isCollapsed || windowWidth > 1000) && (
        <div className="sidebar-content">
          <div className="logo-container">
            <img src="/image073263.png" alt="logo" className="logoSidebar" />
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="search-box"
            />
            {showSearchResults && filteredUsers.length > 0 && (
              <div className="search-results">
                {filteredUsers.map((user) => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="search-result"
                  >
                    {user.businessName ? (
                      <><FaStore /> {user.businessName}</>
                    ) : (
                      <><FaUser /> {user.firstName} {user.lastName}</>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <nav className="title-nav">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="nav-link"
                target={item.target}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default Sidebar;