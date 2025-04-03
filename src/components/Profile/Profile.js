import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Sidebar from "../Sidebar/sidebar.js";
import ProfilePost from "../ProfilePost/ProfilePost.js";
import LinkUpButton from "../LinkUpButton/LinkUpButton.js";
import "../Sidebar/Sidebar.css";
import "../ProfilePost/ProfilePost.css";
import "./Profile.css";
import "../LinkUpButton/LinkUpButton.css";

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            setUserData({
              ...userDoc.data(),
              // Ensure profilePic has a fallback
              profilePic: userDoc.data().profilePic || "/profilepic.png",
            });
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
        navigate("/login");
      }
    };
    fetchUserData();
  }, [userId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!userData) return <p>No user data found.</p>;

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), userData, { merge: true });
        alert("Profile updated successfully!");
        setIsEditing(false);
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
        <h2 className="myProfile">My Profile</h2>

        {/* Profile Picture with fallback */}
        <div className="profile-picture">
          <img
            src={userData.profilePic}
            alt="Profile"
            onError={(e) => {
              e.target.src = "/profilepic.png";
            }}
          />
        </div>

        {/* Edit Button */}
        {auth.currentUser && auth.currentUser.uid === userId && (
          <button
            className="editProfileDetails"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        )}

        {auth.currentUser && auth.currentUser.uid !== userId && (
          <LinkUpButton targetUserId={userId} />
        )}

        {userData.userType === "freelancer" && (
          <div className="freelancer-profile">
            <h3>Freelancer Profile</h3>
            {isEditing ? (
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  value={userData.firstName || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, firstName: e.target.value })
                  }
                />
                <label>Last Name:</label>
                <input
                  type="text"
                  value={userData.lastName || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, lastName: e.target.value })
                  }
                />
                <label>Email:</label>
                <input
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
                <button onClick={handleSaveProfile}>Save</button>
              </div>
            ) : (
              <div className="freelancer-profile-details">
                <p>
                  Name: {userData.firstName} {userData.lastName}
                </p>
                <p>Email: {userData.email}</p>
                <p>User Type: {userData.userType}</p>
              </div>
            )}
          </div>
        )}

        {userData.userType === "business" && (
          <div className="business-profile">
            <h3>Business Profile</h3>
            {isEditing ? (
              <div>
                <label>Business Name:</label>
                <input
                  type="text"
                  value={userData.businessName || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, businessName: e.target.value })
                  }
                />
                <label>Business Address:</label>
                <input
                  type="text"
                  value={userData.businessAddress || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      businessAddress: e.target.value,
                    })
                  }
                />
                <label>Business Description:</label>
                <textarea
                  value={userData.businessDescription || ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      businessDescription: e.target.value,
                    })
                  }
                />
                <label>Email:</label>
                <input
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
                <button onClick={handleSaveProfile}>Save</button>
              </div>
            ) : (
              <div>
                <p>Business Name: {userData.businessName}</p>
                <p>Address: {userData.businessAddress}</p>
                <p>Description: {userData.businessDescription}</p>
                <p>Email: {userData.email}</p>
                <p>User Type: {userData.userType}</p>
              </div>
            )}
          </div>
        )}

        <ProfilePost />
      </div>
    </div>
  );
}

export default Profile;
