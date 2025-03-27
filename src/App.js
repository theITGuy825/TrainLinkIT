import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase authentication
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import PostDetail from "./components/postdetail/postdetail"; // Import PostDetail component
import Messenger from "./components/Messenger/messenger"; // Import Messenger component
import Chats from "./components/Messenger/Chats"; // Import Chats component
import { ChatContextProvider } from "./components/context/ChatContext"; // Import the ChatContextProvider
import JobBoard from "./components/JobBoard/JobBoard";
import Training from "./components/Training/Training";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; // Prevent flickering on load

  // PrivateRoute function to restrict access
  const PrivateRoute = () => {
    return user ? <Outlet /> : <Navigate to="/login" />;
  };

return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/jobs" element={<JobBoard/>} />
          <Route path="/trainings" element={<Training/>} />
          {/* Messenger and Chats inside ChatContextProvider */}
          <Route path="/messenger" element={
            <ChatContextProvider>
              <Messenger />
              <Chats />
            </ChatContextProvider>
          } />
        </Route>

        {/* Redirect Root to Login if not Authenticated */}
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        {/* 404 Page */}
        <Route path="*" element={<p>404 - Page Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
