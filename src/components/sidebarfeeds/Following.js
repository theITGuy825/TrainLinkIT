import React, { useState, useEffect } from "react"; // Getting components from react
import { db } from "../../firebase"; // Importing database and authentication from firebase
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importing Firebase Auth to get the current user's UID
import { FaStore, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"; // Importing Link from react-router-dom
import "./Followers.css"; // Importing the css file for styling

const Following = () => {
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

          const profileImage =
            userData.profilePic && userData.profilePic !== ""
              ? userData.profilePic
              : "profilePic.png"; // Use fallback image if profilePic is empty or undefined

          const fullName = (
            <div className="follower-info">
              <img
                src={profileImage}
                alt={`${userData.firstName || "User"}'s profile`}
                className="profile-img"
              />
              <div className="name-text">
                {userData.firstName && userData.lastName
                  ? `${userData.firstName} ${userData.lastName}`
                  : userData.businessName || "Unknown"}
              </div>
              <div className="icon-text">
                {userData.firstName && userData.lastName ? (
                  <FaUser  />
                ) : (
                  <FaStore />
                )}
              </div>
            </div>
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
      {errorMessage && <p>{errorMessage}</p>}{" "}
      {/* Display error message if it exists */}
      <div className="followers-list">
        {followersDetails.length > 0 ? (
          followersDetails.map((follower) => (
            <div key={follower.userId} className="follower-item">
              <Link to={`/profile/${follower.userId}`}>
                {follower.fullName}
              </Link>
            </div> // Link to their profile page
          ))
        ) : (
          <p className="noFollowers">No following to display</p> // If no following found
        )}
      </div>
    </div>
  );
};

export default Following;
