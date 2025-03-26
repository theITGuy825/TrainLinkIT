import React from "react";
import Chats from "./Chats"; // The Chats component
import Messages from "./Messages"; // The Messages component

const Messenger = () => {
  return (
    <div className="messenger">
      <Chats />
      <Messages />
    </div>
  );
};

export default Messenger;
