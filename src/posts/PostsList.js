import React, { useState, useEffect } from 'react';

function PostsList() {
  const [microposts, setMicroposts] = useState([]);
  const [username, setUsername] = useState('');
  const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Replace with actual JWT token
  const user_id = 1; // Replace with actual user ID

  // Fetch the user's microposts
  useEffect(() => {
    const fetchMicroposts = async () => {
      const url = `http://3.112.191.54:3000/api/v1/users/${user_id}/microposts`;

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
        if (data.length > 0) {
          // Assuming all posts belong to the same user, set the username from the first post
          setUsername(data[0].name);
        }
        setMicroposts(data); // Assuming the response gives a list of microposts
      } catch (error) {
        console.error("Fetching microposts error:", error);
      }
    };

    fetchMicroposts();
  }, [user_id, jwtToken]);

  return (
    <div>
      <h2>{username}様のPosts</h2>
      <ul>
      {microposts.map((post) => (
        <li key={post.id}>
          {/* Make sure to use the correct property name as defined in the serializer */}
          <span>{`${post.name}: ${post.title}`}</span>
          <p>{post.body}</p>
        </li>
      ))}

      </ul>
    </div>
  );
}

export default PostsList;
