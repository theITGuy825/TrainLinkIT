
import { db } from '../../firebase';
import { 
  collection, query, where, getDocs, 
  addDoc, serverTimestamp, doc, getDoc 
} from 'firebase/firestore';

export const checkExistingChat = async (currentUserId, otherUserId) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', currentUserId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.find(doc => 
    doc.data().participants.includes(otherUserId)
  );
};

export const createNewChat = async (currentUserId, otherUserId) => {
  // Check for existing chat
  const existingChat = await checkExistingChat(currentUserId, otherUserId);
  if (existingChat) return existingChat.id;

  // Create new chat
  const newChat = {
    participants: [currentUserId, otherUserId],
    createdAt: serverTimestamp(),
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    lastMessageSender: ''
  };

  const chatRef = await addDoc(collection(db, 'chats'), newChat);
  await createUserChatEntries(currentUserId, otherUserId, chatRef.id);
  return chatRef.id;
};

const createUserChatEntries = async (userId1, userId2, chatId) => {
  // Get user data
  const user1Doc = await getDoc(doc(db, 'users', userId1));
  const user2Doc = await getDoc(doc(db, 'users', userId2));
  
  const userChatsRef = collection(db, 'userChats');
  
  // Create entry for first user
  await addDoc(userChatsRef, {
    userId: userId1,
    chatId,
    otherUserId: userId2,
    otherUserInfo: {
      name: `${user2Doc.data().firstName} ${user2Doc.data().lastName}`,
      profilePic: user2Doc.data().profilePic || '',
      userType: user2Doc.data().userType
    },
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    unreadCount: 0
  });

  // Create entry for second user
  await addDoc(userChatsRef, {
    userId: userId2,
    chatId,
    otherUserId: userId1,
    otherUserInfo: {
      name: `${user1Doc.data().firstName} ${user1Doc.data().lastName}`,
      profilePic: user1Doc.data().profilePic || '',
      userType: user1Doc.data().userType
    },
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    unreadCount: 0
  });
};