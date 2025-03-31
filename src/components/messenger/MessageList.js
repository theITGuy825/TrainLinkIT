import { Box, Typography, Avatar } from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust path to your firebase config

const MessageItem = ({ message, isCurrentUser, senderName, receiverName }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2
      }}
    >
      {/* Sender/Receiver name display */}
      <Typography variant="caption" sx={{ 
        color: 'text.secondary',
        mb: 0.5,
        fontSize: '0.75rem'
      }}>
        {isCurrentUser ? `${senderName}` : `${senderName}`}
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        maxWidth: '70%'
      }}>
        {!isCurrentUser && (
          <Avatar 
            sx={{ mr: 1, width: 32, height: 32 }}
            src={message.senderPhotoURL}
            alt={senderName}
          />
        )}

        <Box sx={{
          bgcolor: isCurrentUser ? 'primary.main' : 'grey.100',
          color: isCurrentUser ? 'white' : 'text.primary',
          p: 1.5,
          borderRadius: 2,
          wordBreak: 'break-word'
        }}>
          <Typography>{message.text}</Typography>
          <Typography variant="caption" sx={{
            display: 'block',
            textAlign: 'right',
            color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'text.secondary'
          }}>
            {message.timestamp?.toDate() ? format(message.timestamp.toDate(), 'h:mm a') : 'Just now'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const MessageList = ({ messages, currentUser }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const uniqueUserIds = new Set();
      
      // Collect all unique user IDs from messages
      messages.forEach(message => {
        uniqueUserIds.add(message.senderId);
        uniqueUserIds.add(message.receiverId);
      });

      // Fetch data for each user
      const users = {};
      for (const userId of uniqueUserIds) {
        if (!userData[userId]) {
          try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
              users[userId] = userDoc.data();
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }

      setUserData(prev => ({ ...prev, ...users }));
    };

    if (messages?.length > 0) {
      fetchUserData();
    }
  }, [messages]);

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUser.uid;
        const sender = userData[message.senderId] || { firstName: 'Unknown' };
        const receiver = userData[message.receiverId] || { firstName: 'Unknown' };

        return (
          <MessageItem
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            senderName={sender.firstName}
            receiverName={receiver.firstName}
          />
        );
      })}
    </Box>
  );
};

export default MessageList;