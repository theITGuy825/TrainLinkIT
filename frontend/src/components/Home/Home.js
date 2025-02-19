import React, {useState} from "react";
import { Link } from "react-router-dom";
import PostFeed from "../PostFeed/PostFeed";

function Home() {


    const [posts, setPosts] = useState([
        { id: 1, author: "Farouk Afolabi", content: "This is my first post!" },
        { id: 2, author: " Ethan Henderson", content: "Loving this platform! it was my idea" },
        { id: 3, author: "Muhammed Ahsan",  content: "I am incharge of the backend stuff"}
      ]);
    
      const [newPost, setNewPost] = useState("");
    
      const handlePostSubmit = () => {
        if (newPost.trim() !== "") {
          const post = {
            id: posts.length + 1,
            author: "Farouk Afolabi", // Replace with actual logged-in user
            content: newPost,
          };
          setPosts([post, ...posts]);
          setNewPost("");
        }
      };


  return (
    <div>
      <h2>Home - Feed</h2>
      <nav>
        <Link to="/jobs">Job Board</Link> | 
        <Link to="/trainings">Trainings</Link> | 
        <Link to="/blog">Blog</Link> | 
        <Link to="/profile">My Profile</Link>
      </nav>

      {/* Create a Post */}
      <div>
        <textarea
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePostSubmit}>Post</button>
      </div>
 {/* Display Posts */}
 <PostFeed posts={posts} title="All Posts" />

      </div>

    

     
    
  );
};
      

export default Home;