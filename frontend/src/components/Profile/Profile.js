import React from "react";
import PostFeed from "../PostFeed/PostFeed";

function Profile ({ posts }) {
    

  return (
    <div>
      <h2>My Profile</h2>
      <h3>My Posts</h3>
       {/* Use PostFeed component instead of manually mapping posts */}
       <PostFeed posts={posts} title="Your Posts" />
    </div>
  );
};

export default Profile;
