import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebarfeeds.css";
import Following from "./Following";
import Followers from "./Followers";
import SuggestedFriends from "./suggestedFriends";
import TrainingSideBar from "./TrainingSideBar";
import {
  FaArrowRight,
  FaArrowLeft,
  FaUserFriends,
  FaChalkboardTeacher,
  FaRegHandshake,
  FaUserCheck,
} from "react-icons/fa";

function Sidebarfeeds() {
  const [selectedSection, setSelectedSection] = useState("following");
  const [activeItem, setActiveItem] = useState(null);
  const [showAllSuggested, setShowAllSuggested] = useState(false);
  const [showAllTrainings, setShowAllTrainings] = useState(false);
  
  const [previewData, setPreviewData] = useState({
    suggested: null,
    trainings: null
  });
  const [fullData, setFullData] = useState({
    suggested: null,
    trainings: null
  });
  const [loading, setLoading] = useState({
    suggested: false,
    trainings: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // If window grows above 1000px, ensure sidebar is expanded
      if (window.innerWidth > 1000) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch preview data on component mount
  useEffect(() => {
    console.log("Selected Section:", selectedSection);
  }, [selectedSection]);
  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        // Simulate fetching preview data (first 3 items)
        const suggestedPreview = await SuggestedFriends.fetchPreview();
        const trainingsPreview = await TrainingSideBar.fetchPreview();
        
        setPreviewData({
          suggested: suggestedPreview,
          trainings: trainingsPreview
        });
      } catch (error) {
        console.error("Error fetching preview data:", error);
      }
    };

    fetchPreviewData();
  }, []);

  const toggleSidebar = () => {
    if (windowWidth <= 1000) {
      setIsCollapsed(!isCollapsed);
    }
  };

  
  const handleItemClick = async (index) => {
    if (index === 0) {
      if (!fullData.suggested && !loading.suggested) {
        setLoading(prev => ({...prev, suggested: true}));
        try {
          const data = await SuggestedFriends.fetchAll();
          setFullData(prev => ({...prev, suggested: data}));
        } catch (error) {
          console.error("Error fetching suggested friends:", error);
        } finally {
          setLoading(prev => ({...prev, suggested: false}));
        }
      }
      setShowAllSuggested(!showAllSuggested);
    } else if (index === 1) {
      if (!fullData.trainings && !loading.trainings) {
        setLoading(prev => ({...prev, trainings: true}));
        try {
          const data = await TrainingSideBar.fetchAll();
          setFullData(prev => ({...prev, trainings: data}));
        } catch (error) {
          console.error("Error fetching trainings:", error);
        } finally {
          setLoading(prev => ({...prev, trainings: false}));
        }
      }
      setShowAllTrainings(!showAllTrainings);
    }
    setActiveItem(activeItem === index ? null : index);
  };

  const menuItems = [
    { 
      title: "Suggested Friends", 
      icon: <FaUserFriends />,
      link: "#"
    },
    { 
      title: "Trainings", 
      icon: <FaChalkboardTeacher />,
      link: "#"
    },
  ];

  // Calculate width based on window size
  const getSidebarWidth = () => {
    if (windowWidth <= 1000) {
      return isCollapsed ? '30px' : '300px';
    } else if (windowWidth > 1000 && windowWidth <= 1400) {
      return '225px';
    } else {
      return '350px';
    }
  };

  // Determine if arrow should be shown
  const showArrow = windowWidth <= 1000;

  return (
    <div 
      className={`sidebarfeeds ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: getSidebarWidth()
      }}
    >
      {showArrow && (
        <button 
          className="arrow-icon"
          onClick={toggleSidebar}
        >
          {isCollapsed ?  <FaArrowLeft /> : <FaArrowRight />}
        </button>
      )}
      
      {(!isCollapsed || windowWidth > 1000) && (
        <div className="sidebarfeeds-title">
          <h3 className="my-app-updates">Updates</h3>

          <nav className="title-navigation">
            {menuItems.map((item, index) => (
              <div key={index}>
                <Link
                  to={item.link}
                  onClick={() => handleItemClick(index)}
                  className={activeItem === index ? "active" : ""}
                >
                  <span className="iconRender">{item.icon}</span>
                  <span className="textRender">{item.title}</span>
                  {loading[index === 0 ? "suggested" : "trainings"] && (
                    <span className="loading-spinner">...</span>
                  )}
                </Link>

                {index === 0 && (
                  <div className="submenu">
                    {showAllSuggested ? (
                      <SuggestedFriends 
                        data={fullData.suggested} 
                        showAll={true} 
                      />
                    ) : (
                      <SuggestedFriends 
                        data={previewData.suggested} 
                        showAll={false} 
                      />
                    )}
                  </div>
                )}
                {index === 1 && (
                  <div className="submenu">
                    {showAllTrainings ? (
                      <TrainingSideBar 
                        data={fullData.trainings} 
                        showAll={true} 
                      />
                    ) : (
                      <TrainingSideBar 
                        data={previewData.trainings} 
                        showAll={false} 
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="friends">
            <button
              className={selectedSection === "followers" ? "active-btn" : ""}
              onClick={() => setSelectedSection("followers")} 
            >
              <FaUserCheck className="userCheck"/>
              Followers
            </button>
            <button
              className={selectedSection === "following" ? "active-btn" : ""}
              onClick={() => setSelectedSection("following")}
            >
              <FaRegHandshake className="handShake"/>
              Following
            </button>
          </div>

          <div className="follow-section">
            {selectedSection === "following" && <Following />}
            {selectedSection === "followers" && <Followers />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebarfeeds;