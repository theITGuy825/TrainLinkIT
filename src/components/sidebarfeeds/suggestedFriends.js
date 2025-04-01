import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaStore, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./suggestedFriends.css"; // Import CSS file for styling

const SuggestedFriends = ({ showAll }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const authorization = getAuth();
    const userId = authorization.currentUser
      ? authorization.currentUser.uid
      : null;
    if (!userId) {
      setErrorMessage("No user is logged in!");
      setLoading(false);
      return;
    }

    const fetchSuggestedUsers = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setErrorMessage("User not found.");
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const followingList = userData.following || [];
        const followersList = userData.followers || [];

        const allUsersSnap = await getDocs(collection(db, "users"));
        const allUsers = allUsersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredUsers = allUsers.filter(
          (user) =>
            user.id !== userId &&
            !followingList.includes(user.id) &&
            !followersList.includes(user.id)
        );

        const formattedUsers = filteredUsers.map((user) => {
          const profileImage =
            user.profilePic && user.profilePic !== ""
              ? user.profilePic
              : "profilePic.png";
          const displayName = (
            <div className="user-profile">
              <img
                src={profileImage}
                alt={`${
                  user.firstName || user.businessName || "User"
                }'s profile`}
                className="profile-image"
              />
              <div className="user-info">
                {user.firstName && user.lastName ? (
                  <>
                    <div className="fullName">
                      {user.firstName} {user.lastName}
                    </div>
                    <FaUser className="user-icon" />
                  </>
                ) : (
                  <>
                    <div className="businessName">
                      {user.businessName || "Unknown"}
                    </div>
                    <FaStore className="business-icon" />
                  </>
                )}
              </div>
            </div>
          );

          return { id: user.id, displayName };
        });

        setSuggestedUsers(formattedUsers);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Error fetching suggested friends.");
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <div className="suggested-friends-container">
      {loading && <p className="loading-message">Loading...</p>} {/* Loading message */}
      {errorMessage && !loading && <p className="error-message">{errorMessage}</p>}
      <div className="suggested-friends-list">
        {suggestedUsers.length > 0 ? (
          showAll ? (
            suggestedUsers.map((user) => (
              <div key={user.id} className="suggested-friend-item">
                <Link to={`/profile/${user.id}`} className="friend-link">
                  {user.displayName}
                </Link>
              </div>
            ))
          ) : (
            <div className="suggested-friend-item">
              <Link
                to={`/profile/${suggestedUsers[0]?.id}`}
                className="friend-link"
              >
                {suggestedUsers[0]?.displayName}
              </Link>
            </div>
          )
        ) : (
          <p className="no-suggestions">No suggested friends available.</p>
        )}
      </div>
    </div>
  );
};

export default SuggestedFriends;
