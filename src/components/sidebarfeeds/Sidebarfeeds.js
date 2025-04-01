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

  // Fetch preview data on component mount
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

  return (
    <div className="sidebarfeeds">
      <button className="arrow-icon"><FaArrowLeft /></button>
      
      <div className="sidebarfeeds-title">
        <h3 className="my-app">Updates</h3>

        <nav className="title-nav">
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
            <FaUserCheck />
            Followers
          </button>
          <button
            className={selectedSection === "following" ? "active-btn" : ""}
            onClick={() => setSelectedSection("following")}
          >
            <FaRegHandshake />
            Following
          </button>
        </div>

        <div className="follow-section">
          {selectedSection === "following" && <Following />}
          {selectedSection === "followers" && <Followers />}
        </div>
      </div>
    </div>
  );
}

export default Sidebarfeeds;