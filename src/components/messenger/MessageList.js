import { Box, Typography, Avatar } from '@mui/material';
import { format } from 'date-fns';

const MessageItem = ({ message, isCurrentUser }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          maxWidth: '70%'
        }}
      >
        {!isCurrentUser && (
          <Avatar sx={{ mr: 1, width: 32, height: 32 }} />
        )}
        
        <Box
          sx={{
            bgcolor: isCurrentUser ? 'primary.main' : 'grey.100',
            color: isCurrentUser ? 'white' : 'text.primary',
            p: 1.5,
            borderRadius: 2,
            wordBreak: 'break-word'
          }}
        >
          <Typography>{message.text}</Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'right',
              color: isCurrentUser ? 'white' : 'text.secondary'
            }}
          >
            {message.timestamp?.toDate() ? format(message.timestamp.toDate(), 'h:mm a') : 'Just now'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const MessageList = ({ messages, currentUser }) => {
  return (
    <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.sender === currentUser.uid}
        />
      ))}
    </Box>
  );
};

export default MessageList;