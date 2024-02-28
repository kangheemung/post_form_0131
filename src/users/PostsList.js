import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
function PostsList() {
  const [microposts, setMicroposts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Replace with actual JWT token
  //const user_id = 1; // Replace with actual user ID
  const jwtToken = localStorage.getItem('token')
  let { id } = useParams();
  const navigate = useNavigate();
  // Fetch the user's microposts
  useEffect(() => {
    const fetchMicroposts = async () => {
      const url = `http://13.115.91.176:3000/api/v1/users/${id}`;

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

        const result = await response.json();
        console.log(result);
        // The data is directly under 'data' key, so update the state accordingly
        setMicroposts(result.data);
        // The username is under 'user.name'
        setUsername(result.user.name);
        setEmail(result.user.email);

      } catch (error) {
        console.error("Fetching microposts error:", error);
        // Reset the states if there's an error
        setEmail('');
        setUsername('');
        setMicroposts([]);
      }
    };

    fetchMicroposts();
  }, [id, jwtToken]);


  const handleHome = () => {
    navigate('/'); // Navigate back to home
  };




  return (
    <div>
      <h2>{username}様の投稿したPosts</h2>
      <p>email:{email}</p>
      <ul className= "ul">
      {microposts.map((post) => (
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
      <button onClick={handleHome}>homeに戻る</button> 
    </div>
  );
}

export default PostsList;