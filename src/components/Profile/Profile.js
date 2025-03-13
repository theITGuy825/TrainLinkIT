import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../../firebase"; // Import Firebase auth and Firestore
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import Sidebar from "../Sidebar/sidebar.js";
import PostFeed from "../PostFeed/PostFeed.js";
import LinkUpButton from '../LinkUpButton/LinkUpButton'; // Import the follow functionality
import '../Sidebar/Sidebar.css';
import '../PostFeed/PostFeed.css';
import './Profile.css';

function Profile() {
  const { uid } = useParams(); // Get the user ID from the URL
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", uid)); // Fetch data for the user in the URL
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.error("User data not found");
        }
      } else {
        navigate("/login"); // Redirect to login if not authenticated
      }
    };
    fetchUserData();
  }, [navigate, uid]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <Sidebar />
      <div className="profile-content">
        <h2>My Profile</h2>
        {userData.userType === "freelancer" && (
          <div className="freelancer-profile">
            <h3>Freelancer Profile</h3>
            <p>Name: {userData.firstName} {userData.lastName}</p>
            <p>Email: {userData.email}</p>
            <p>User Type: {userData.userType}</p>
            {/* Add more freelancer-specific fields here */}
          </div>
        )}
        {userData.userType === "business" && (
          <div className="business-profile">
            <h3>Business Profile</h3>
            <p>Business Name: {userData.businessName}</p>
            <p>Address: {userData.businessAddress}</p>
            <p>Description: {userData.businessDescription}</p>
            <p>User Type: {userData.userType}</p>
            {/* Add more business-specific fields here */}
          </div>
        )}

        {/* Display followers and following counts */}
        <p>Followers: {userData.followers ? userData.followers.length : 0}</p>
        <p>Following: {userData.following ? userData.following.length : 0}</p>
        
        {/* Add the Link Up button */}
        <LinkUpButton targetUserId={uid} />
        <PostFeed />
      </div>
    </div>
  );
}

export default Profile;