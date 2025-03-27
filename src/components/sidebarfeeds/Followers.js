import React, { useState, useEffect } from "react"; // Getting components from React
import { db } from "../../firebase"; // Importing database from Firebase
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importing Firebase Auth to get the current user's UID
import { FaStore, FaUser } from "react-icons/fa";
import "./Following.css"; // Importing CSS file for styling

const Followers = () => {
  const [followers, setFollowers] = useState([]); // List of followers updating every time
  const [errorMessage, setErrorMessage] = useState(""); // To hold error message
  const [followersDetails, setFollowersDetails] = useState([]); // To store followers with full name

  useEffect(() => {
    const authorization = getAuth(); // Get the authentication instance
    const userId = authorization.currentUser
      ? authorization.currentUser.uid
      : null; // Get the current user ID

    if (!userId) return setErrorMessage("No user is logged in!"); // If no user ID, return

    const userRef = doc(db, "users", userId); // Get the user document reference

    const fetchUserData = async () => {
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.followers && Array.isArray(userData.followers)) {
          setFollowers(userData.followers); // Set followers list
          fetchFollowersDetails(userData.followers); // Fetch details for each follower
        } else {
          setFollowers([]);
          setErrorMessage("No followers found.");
        }
      } else {
        setErrorMessage("No such document!");
      }
    };

    const fetchFollowersDetails = async (followersList) => {
      const followersData = [];

      for (const userId of followersList) {
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
                <div className="fullName">{userData.firstName} {userData.lastName}</div> 
                <FaUser />
              </span>
            ) : (
              <span>
                <img src={profileImage} alt={`${userData.businessName || 'Business'}'s profile`} />
                <div className="businessName">{userData.businessName || "Unknown"}</div> 
                <FaStore />
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
      {errorMessage && <p>{errorMessage}</p>} {/* Display error message if it exists */}
      <ul>
        {followersDetails.length > 0 ? (
          followersDetails.map((follower) => (
            <li key={follower.userId}>{follower.fullName}</li> // Display full name or business name
          ))
        ) : (
          <p>No followers to display</p> // If no followers found
        )}
      </ul>
    </div>
  );
};

export default Followers;
