import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import "./LinkUpButton.css"

function LinkUpButton({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkIfFollowing = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (currentUserDoc.exists()) {
            const following = currentUserDoc.data().following || [];
            setIsFollowing(following.includes(targetUserId));
          } else {
            setError('Current user document not found.');
          }
        } catch (error) {
          console.error('Error checking follow status:', error);
          setError('Failed to check follow status.');
        }
      }
    };
    checkIfFollowing();
  }, [targetUserId]);

  const handleLinkUp = async () => {
    setLoading(true);
    setError('');
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
      setError('Failed to update follow status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <button onClick={handleLinkUp} disabled={loading} className='linkup-btn'>
        {loading ? 'Processing...' : isFollowing ? 'Unlink' : 'Link Up'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default LinkUpButton;