import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./src/components/Login/Login";
import Register from "./src/components/Register/Register";
import Home from "./src/components/Home/Home";
import Profile from "./src/components/Profile/Profile";
import PostFeed from "./src/components/PostFeed/PostFeed"; // Import PostFeed

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
