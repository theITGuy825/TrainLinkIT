import React, { useState } from "react";

function PostFeed({ title }) {
  // Manage posts within PostFeed.js
  const [posts, setPosts] = useState([
    { id: 1, author: "Farouk Afolabi", content: "This is my first post!" },
    { id: 2, author: "Ethan Henderson", content: "Loving this platform! It was my idea." },
    { id: 3, author: "Muhammed Ahsan", content: "I am in charge of the backend stuff." },
    { id: 4, author: "Farouk Afolabi", content: "This is my first post!" },
    { id: 5, author: "Ethan Henderson", content: "Loving this platform! It was my idea." },
    { id: 6, author: "Muhammed Ahsan", content: "I am in charge of the backend stuff." }
  ]);

  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = () => {
    if (newPost.trim() !== "") {
      const post = {
        id: posts.length + 1,
        author: "Farouk Afolabi", // This can be replaced with the logged-in user info
        content: newPost,
      };
      setPosts([post, ...posts]);
      setNewPost(""); // Clear the textarea
    }
  };

  return (
    <div>
      <h2>{title}</h2>

      {/* Create a Post */}
      <div className="post-creation">
        <textarea
          className="textarea"
          placeholder="What's on your mind?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button className="post-button" onClick={handlePostSubmit}>Post</button>
      </div>

      {/* Display Posts */}
      <div className="post-feed-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <h4>{post.author}</h4>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default PostFeed;
