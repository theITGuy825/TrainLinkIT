import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";

function App() {
  const [posts, setPosts] = useState([
    { id: 1, author: "Farouk Afolabi", content: "This is my first post!" },
    { id: 2, author: "Ethan Henderson", content: "Loving this platform! It was my idea" },
    { id: 3, author: "Muhammed Ahsan", content: "I am in charge of the backend stuff" },
  ]);
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home posts={posts} setPosts={setPosts}/>} />
      <Route path="/profile" element={<Profile posts={posts} />} />
    </Routes>
  </Router>
    
  );
}

export default App;
