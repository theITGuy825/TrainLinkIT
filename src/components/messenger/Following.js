import React, { useState, useEffect } from "react"; // Getting components from react
import { db } from "../../firebase"; // Importing database and authentication from firebase
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importing Firebase Auth to get the current user's UID
import { FaStore, FaUser } from "react-icons/fa";
import "./Following.css"; // Importing the css file for styling

const Followers = () => {
  const [following, setFollowing] = useState([]); // List of following users updating every time
  const [errorMessage, setErrorMessage] = useState(""); // To hold error message
  const [followersDetails, setFollowersDetails] = useState([]); // To store followers with full name

  useEffect(() => {
    const authorization = getAuth(); // Get the authentication instance
    const userId = authorization.currentUser
      ? authorization.currentUser.uid
      : null; // Get the current user id

    if (!userId) return setErrorMessage("No user is logged in!"); // If there is no user id, return

    const userRef = doc(db, "users", userId); // Get the user document reference

    const fetchUserData = async () => {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.following && Array.isArray(userData.following)) {
          setFollowing(userData.following); // Set following list
          fetchFollowersDetails(userData.following); // Fetch details for each follower
        } else {
          setFollowing([]);
          setErrorMessage("No following found.");
        }
      } else {
        setErrorMessage("No such document!");
      }
    };

    const fetchFollowersDetails = async (followingList) => {
      const followersData = [];

      for (const userId of followingList) {
        const userRef = doc(db, "users", userId); // Get each follower document reference
        const userSnap = await getDoc(userRef);
      
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          const profileImage = userData.profilePic && userData.profilePic !== "" 
            ? userData.profilePic 
            : "profilePic.png"; // Use fallback image if profilePic is empty or undefined
          
          const fullName =
            userData.firstName && userData.lastName ? (
              <span>
                <img src={profileImage} alt={`${userData.firstName || 'User'}'s profile`} />
                {userData.firstName} {userData.lastName} <FaUser />
              </span>
            ) : (
              <span>
                <img src={profileImage} alt={`${userData.businessName || 'Business'}'s profile`} />
                {userData.businessName || "Unknown"} <FaStore />
              </span>
            ); // Fallback to businessName or 'Unknown'
      
          followersData.push({ userId, fullName });
        }
      }

      setFollowersDetails(followersData); // Set followers details state
    };

    fetchUserData();
  }, []); // Empty dependency array means this will run once on component mount

  return (
    <div>
      <h2>Following</h2>
      {errorMessage && <p>{errorMessage}</p>}{" "}
      {/* Display error message if it exists */}
      <ul>
        {followersDetails.length > 0 ? (
          followersDetails.map((follower) => (
            <li key={follower.userId}>{follower.fullName}</li> // Display full name or business name
          ))
        ) : (
          <p>No following to display</p> // If no following found
        )}
      </ul>
    </div>
  );
};

export default Followers;
