import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Page() {
  let { id, user_id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Your JWT token

  useEffect(() => {
    const url = `http://3.112.191.54:3000/api/v1/users/${user_id}/microposts/${id}`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 200) {
        setPost(data.data);
      } else if (data.status === 404) {
        console.error('Micropost not found');
        // Handle micropost not found, e.g., show a message to the user
      } else if (data.status === 401) {
        console.error('Unauthorized');
        // Handle unauthorized status, e.g., navigate to a login page
      }
    })
    .catch(error => {
      console.error('Error fetching post:', error);
    });
  }, [id, user_id]);

  const handleEdit = () => {
    // Navigate to the edit page for the post
    navigate(`/api/v1/users/${user_id}/micropost/${id}`);
  };

  return (
    <div>
      {/* Display the post based on the fetched data */}
      {post ? (
        <article>
          <p>投稿した内容</p>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <button onClick={handleEdit}>編集</button> {/* Add the edit button */}
        </article>
      ) : (
        <p>Loading...</p> // Provide feedback while loading or if no post is available
      )}
    </div>
  );
}

export default Page;
