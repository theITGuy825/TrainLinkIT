import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import PostFeed from "./components/PostFeed/PostFeed"; // Import PostFeed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={<Home />}  // Now no need to pass posts and setPosts
        />
        <Route
          path="/profile"
          element={<Profile />}  // No need to pass posts to Profile anymore
        />
      </Routes>
    </Router>
  );
}

export default App;
