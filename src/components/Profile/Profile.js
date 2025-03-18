import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase"; // Import Firebase auth and Firestore
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions
import Sidebar from "../Sidebar/sidebar.js";
import PostFeed from "../PostFeed/PostFeed.js";
import '../Sidebar/Sidebar.css';
import '../PostFeed/PostFeed.css';
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError("User data not found");
          }
        } catch (err) {
          setError("Failed to fetch user data");
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    };
    fetchUserData();
  }, [navigate]);

  
  if (loading) return <p>Loading...</p>;
if (error) return <p style={{ color: "red" }}>{error}</p>;

const handleSaveProfile = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      // Update Firestore with the new user data
      await setDoc(doc(db, "users", user.uid), userData, { merge: true });
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    }
  }
};

return (
  <div className="profile-container">
    <Sidebar />
    <div className="profile-content">
      <h2>My Profile</h2>

      {/* Profile Picture Here */}
      <div className="profile-picture">
        <img
          src={userData.profilePic || "https://via.placeholder.com/150"} // Default placeholder if no profile picture
          alt="Profile"
        />
      </div>

      {/* Edit Button */}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit Profile"}
      </button>

      {userData.userType === "freelancer" && (
        <div className="freelancer-profile">
          <h3>Freelancer Profile</h3>
          {isEditing ? (
            // Editable Fields for Freelancer
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
              />
              <label>Last Name:</label>
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
              />
              <label>Email:</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
              {/* Add more editable fields here */}
              <button onClick={handleSaveProfile}>Save</button>
            </div>
          ) : (
            // Display Fields for Freelancer
            <div>
              <p>Name: {userData.firstName} {userData.lastName}</p>
              <p>Email: {userData.email}</p>
              <p>User Type: {userData.userType}</p>
              {/* Add more freelancer-specific fields here */}
            </div>
          )}
        </div>
      )}

      {userData.userType === "business" && (
        <div className="business-profile">
          <h3>Business Profile</h3>
          {isEditing ? (
            // Editable Fields for Business
            <div>
              <label>Business Name:</label>
              <input
                type="text"
                value={userData.businessName}
                onChange={(e) =>
                  setUserData({ ...userData, businessName: e.target.value })
                }
              />
              <label>Business Address:</label>
              <input
                type="text"
                value={userData.businessAddress}
                onChange={(e) =>
                  setUserData({ ...userData, businessAddress: e.target.value })
                }
              />
              <label>Business Description:</label>
              <textarea
                value={userData.businessDescription}
                onChange={(e) =>
                  setUserData({ ...userData, businessDescription: e.target.value })
                }
              />
              <label>Email:</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
              {/* Add more editable fields here */}
              <button onClick={handleSaveProfile}>Save</button>
            </div>
          ) : (
            // Display Fields for Business
            <div>
              <p>Business Name: {userData.businessName}</p>
              <p>Address: {userData.businessAddress}</p>
              <p>Description: {userData.businessDescription}</p>
              <p>Email: {userData.email}</p>
              <p>User Type: {userData.userType}</p>
              {/* Add more business-specific fields here */}
            </div>
          )}
        </div>
      )}

      <PostFeed />
    </div>
  </div>
);
}

export default Profile;