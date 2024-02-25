import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
function PostsList() {
  const [microposts, setMicroposts] = useState([]);
  const [username, setUsername] = useState('');
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Replace with actual JWT token
  //const user_id = 1; // Replace with actual user ID
  const jwtToken = localStorage.getItem('token')
  let { user_id } = useParams();
  const navigate = useNavigate();
  // Fetch the user's microposts
  useEffect(() => {
    const fetchMicroposts = async () => {
      const url = `http://43.207.204.18:3000/api/v1/users/${user_id}/microposts`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if (data && data.microposts) {
          setUsername(data.microposts[0].user.name); // Adjust if necessary to match your data structure
          setMicroposts(data.microposts);
        } else {
          // Handle case where 'microposts' is not present or not an array
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error("Fetching microposts error:", error);
        // Optionally add error handling logic here, e.g., show an error message to the user
      }
    };

    fetchMicroposts();
  }, [user_id, jwtToken]);

  const handlehome = () => {
    // Navigate to the edit page for the post
    navigate(`/`);
  };
  return (
    <div>
      <h2>{username}様の投稿したPosts</h2>
      <ul>
      {Array.isArray(microposts) && microposts.map((post) => (
        <li key={post.id}>
          {/* Make sure to use the correct property name as defined in the serializer */}
          <p>==================</p>
          <p>title内容</p>
          <span>{post.title}</span>
          <p>body内容</p>
          <p>{post.body}</p>
          <p>==================</p>
        </li>
      ))}

      </ul>
      <button onClick={handlehome}>homeに戻る</button> 
    </div>
  );
}

export default PostsList;
