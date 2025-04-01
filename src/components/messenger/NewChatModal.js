import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Dialog, 
  DialogTitle, 
  TextField, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText,
  CircularProgress
} from '@mui/material'


const NewChatModal = ({ open, onClose, currentUserId, onCreateChat }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!open || !currentUserId) return;
      
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        // Query all users except current user
        const q = query(usersRef, where('uid', '!=', currentUserId));
        const querySnapshot = await getDocs(q);
        
        const usersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          fullName: `${doc.data().firstName} ${doc.data().lastName}`
        }));
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open, currentUserId]);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Start New Chat</DialogTitle>
      <div style={{ padding: '0 24px' }}>
        <TextField
          label="Search by name or email"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <List style={{ maxHeight: '400px', overflow: 'auto' }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <ListItem 
                button 
                key={user.uid}
                onClick={() => {
                  onCreateChat(user.uid);
                  onClose();
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    src={user.profilePic || ''} 
                    alt={user.fullName}
                  >
                    {!user.profilePic && user.firstName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={user.fullName} 
                  secondary={user.email}
                  
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No users found" />
            </ListItem>
          )}
        </List>
      )}
    </Dialog>
  );
};

export default NewChatModal;