import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { data, dispatch } = useContext(ChatContext); // Now 'dispatch' should be available

  useEffect(() => {
    if (!data.chatId) return;

    const unsubscribe = onSnapshot(doc(db, "userChats", data.chatId), (doc) => {
      setChats(doc.data() || {});
    });

    return () => unsubscribe();
  }, [data.chatId]);

  const handleSelect = (chat) => {
    dispatch({ type: "CHANGE_CHAT", payload: chat.id }); // Example of dispatch
  };

  return (
    <div className="chats">
      {Object.entries(chats).map(([key, chat]) => (
        <div key={key} className="userChat" onClick={() => handleSelect(chat)}>
          <img src={chat.userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat.userInfo.displayName}</span>
            <p>{chat.lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
