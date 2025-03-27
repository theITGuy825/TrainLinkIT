import React from "react";
import Chats from "./Chats"; // The Chats component
import Messages from "./Messages"; // The Messages component
import Sidebar from "../Sidebar/sidebar.js";
import Followers from "./Following.js";
const Messenger = () => {
  return (
    <div className="messenger">
      <Sidebar />
      <Chats />
      <Messages />
      <Followers />
    </div>
  );
};

export default Messenger;
