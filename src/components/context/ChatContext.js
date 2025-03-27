import React, { createContext, useReducer } from "react";

// Initialize the context
export const ChatContext = createContext();

const INITIAL_STATE = {
  chatId: null,
  user: null,
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_CHAT":
      return { ...state, chatId: action.payload };
    default:
      return state;
  }
};

export const ChatContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
