import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import PostDetail from "./components/postdetail/postdetail";
import Messenger from "./components/messenger/messenger";
import { AuthProvider, useAuth } from './context/AuthContext';
import JobBoard from "./components/JobBoard/JobBoard";
import Training from "./components/Training/Training";
import JobBoardDetail from "./components/JobBoardDetail/JobBoardDetail";
function App() {
  return (
    <AuthProvider>
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
            <Route path="/jobboarddetail/:jobId" element={<JobBoardDetail />} />
            <Route path="/jobs" element={<JobBoard/>} />
            <Route path="/trainings" element={<Training/>} />
            <Route path="/messenger" element={<Messenger />} />
          </Route>

          {/* Redirect Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* 404 Page */}
          <Route path="*" element={<p>404 - Page Not Found</p>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// PrivateRoute component using AuthContext
const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>;
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

// RootRedirect component using AuthContext
const RootRedirect = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

export default App;