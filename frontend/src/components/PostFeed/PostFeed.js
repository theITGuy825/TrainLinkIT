import React from "react";

function PostFeed  ({ posts, title }) {
  return (
    <div>
      <h2>{title}</h2>
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
  );
};

export default PostFeed;