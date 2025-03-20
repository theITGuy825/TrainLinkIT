import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase"; // Import Firebase config
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

function Messenger() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  // Listen to real-time messages
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Send message
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "/profilepic.png",
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="messenger">
      <h2>Chat Room</h2>
      {user ? (
        <>
          <button onClick={() => signOut(auth)}>Logout</button>
          <div className="chat-box">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.userId === user.uid ? "sent" : "received"}`}>
                <img src={msg.userPhoto} alt="User" className="profile-pic" />
                <div>
                  <strong>{msg.userName}</strong>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      ) : (
        <p>Please log in to chat.</p>
      )}
    </div>
  );
}

export default Messenger;
