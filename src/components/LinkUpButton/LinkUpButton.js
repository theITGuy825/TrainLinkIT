import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function LinkUpButton({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfFollowing = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (currentUserDoc.exists()) {
          const following = currentUserDoc.data().following || [];
          setIsFollowing(following.includes(targetUserId));
        }
      }
    };
    checkIfFollowing();
  }, [targetUserId]);

  const handleLinkUp = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert('You must be logged in to follow users.');
      return;
    }

    try {
      const currentUserRef = doc(db, 'users', currentUser.uid);
      const targetUserRef = doc(db, 'users', targetUserId);

      if (isFollowing) {
        // Unfollow: Remove targetUserId from current user's following list
        await updateDoc(currentUserRef, {
          following: arrayRemove(targetUserId),
        });
        // Remove currentUserId from target user's followers list
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid),
        });
        setIsFollowing(false);
      } else {
        // Follow: Add targetUserId to current user's following list
        await updateDoc(currentUserRef, {
          following: arrayUnion(targetUserId),
        });
        // Add currentUserId to target user's followers list
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid),
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLinkUp} disabled={loading}>
      {isFollowing ? 'Unlink' : 'Link Up'}
    </button>
  );
}

export default LinkUpButton;