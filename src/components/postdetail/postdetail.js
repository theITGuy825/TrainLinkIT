import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // For accessing the post ID from the URL
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import './PostDetail.css';

function PostDetail() {
  const { postId } = useParams(); // Get the postId from the URL
  const [post, setPost] = useState(null);

  // Fetch the individual post based on the postId
  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = await getDoc(doc(db, "posts", postId));
      if (postDoc.exists()) {
        setPost(postDoc.data());
      } else {
        console.log("Post not found");
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="post-detail-container">
      {post ? (
        <div className="post-detail">
          <h2>{post.content}</h2>
          <p>Posted by: {post.userId}</p>
          {/* Display the post's comments and other details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PostDetail;
