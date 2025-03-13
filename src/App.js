import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import PostFeed from "./components/PostFeed/PostFeed";
import PostDetail from "./components/postdetail/postdetail"; // Import the PostDetail component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/post/:postId" element={<PostDetail />} /> {/* Dynamic Route for Individual Post */}
      </Routes>
    </Router>
  );
}

export default App;
