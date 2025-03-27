import React, { useState, useEffect, useContext } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (!data.chatId) {
      return; // Do nothing if there is no chatId selected
    }

    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []); // Make sure messages default to empty array
      }
    });

    return () => unsub();
  }, [data.chatId]);

  if (!data.chatId) {
    return <p>Select a chat to view messages.</p>; // Optionally, show a message if no chat is selected
  }

  return (
    <div className="messages">
      {messages.map((message, index) => (
        <div key={index} className="message">
          {/* Display message sender's profile picture */}
          <img
            src={message.senderProfilePic || "/default-profile-pic.png"}
            alt={message.senderFirstName}
            className="profile-pic"
          />
          <div className="message-content">
            <strong>{`${message.senderFirstName} ${message.senderLastName}`}</strong>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
