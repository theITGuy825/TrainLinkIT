import { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const MessageInput = ({ onSend }) => {
  
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && typeof onSend === 'function') {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="submit"
                disabled={!message.trim()}
                color="primary"
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </Box>
  );
};

export default MessageInput;