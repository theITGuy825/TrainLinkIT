import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatList from "./ChatList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import NewChatModal from "./NewChatModal";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import Sidebar from "../Sidebar/sidebar.js";
import "../Sidebar/Sidebar.css";
import "./messanger.css";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const Messenger = () => {
  const { currentUser } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  // Fetch chats for the current user
  useEffect(() => {
    if (!currentUser?.uid) return;

    setLoadingChats(true);
    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData = [];
      querySnapshot.forEach((doc) => {
        chatsData.push({
          id: doc.id,
          ...doc.data(),
          lastMessage: doc.data().lastMessage || "",
          lastMessageSender: doc.data().lastMessageSender || "",
        });
      });
      setChats(chatsData);
      setLoadingChats(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch messages for the active chat
  useEffect(() => {
    if (!activeChat?.id) return;

    const messagesRef = collection(db, "chats", activeChat.id, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);

      // Update last message in chat document
      if (messagesData.length > 0) {
        const lastMessage = messagesData[messagesData.length - 1];
        updateDoc(doc(db, "chats", activeChat.id), {
          lastMessage: lastMessage.text,
          lastMessageSender: lastMessage.senderId,
        });
      }
    });

    return () => unsubscribe();
  }, [activeChat]);

  const handleSendMessage = async (messageText) => {
    if (!activeChat?.id || !messageText.trim()) return;

    try {
      const messagesRef = collection(db, "chats", activeChat.id, "messages");
      await addDoc(messagesRef, {
        text: messageText,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateChat = async (participantId) => {
    if (!currentUser?.uid) return;

    try {
      // Check if chat already exists
      const existingChat = chats.find(
        (chat) =>
          chat.participants.includes(participantId) &&
          chat.participants.length === 2
      );

      if (existingChat) {
        setActiveChat(existingChat);
        setNewChatOpen(false);
        return;
      }

      // Create new chat
      const newChatRef = doc(collection(db, "chats"));
      await setDoc(newChatRef, {
        participants: [currentUser.uid, participantId],
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageSender: "",
      });

      setActiveChat({
        id: newChatRef.id,
        participants: [currentUser.uid, participantId],
      });
      setNewChatOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSelectChat = (chatId) => {
    const selectedChat = chats.find((chat) => chat.id === chatId);
    setActiveChat(selectedChat);
  };

  return (
    <div>
      <div className="sidebarContainer">
        <Sidebar />
      </div>
      <div className="chatContainer">
        <Box
          sx={{
            display: "flex",
            height: "80vh",
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          {/* Left sidebar - Chat list */}
          <Box
            sx={{
              width: 300,
              borderRight: "1px solid #ddd",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Messages</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setNewChatOpen(true)}
                data-testid="new-chat-button"
              >
                New chat
              </Button>
            </Box>
            <ChatList
              chats={chats}
              currentUser={currentUser}
              activeChat={activeChat?.id}
              onSelectChat={handleSelectChat}
              loading={loadingChats}
            />
          </Box>

          {/* Right side - Messages */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {activeChat ? (
              <>
                <MessageList
                  activeChat={activeChat}
                  messages={messages}
                  currentUser={currentUser}
                />
                <MessageInput onSend={handleSendMessage} />
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  {newChatOpen
                    ? "Select a user to start chatting"
                    : "Select a chat or start a new conversation"}
                </Typography>
              </Box>
            )}
          </Box>

          {/* New Chat Modal */}
          <NewChatModal
            open={newChatOpen}
            onClose={() => setNewChatOpen(false)}
            onCreateChat={handleCreateChat}
            currentUserId={currentUser?.uid}
          />
        </Box>
      </div>
    </div>
  );
};

export default Messenger;
