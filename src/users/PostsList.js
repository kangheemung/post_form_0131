import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostsList.css';
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
      const url = `http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${id}`;

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
        //console.log(result);
        // The data is directly under 'data' key, so update the state accordingly
        setMicroposts(result.data);
        // The username is under 'user.name'
        setUsername(result.user.name);
        setEmail(result.user.email);

      } catch (error) {
        console.error("Fetching microposts error:", error);
        // Reset the states if there's an error
        //setEmail('');
        //setUsername('');
        //setMicroposts([]);
      }
    };

    fetchMicroposts();
  }, [id, jwtToken]);


  const handleHome = () => {
    navigate('/'); // Navigate back to home
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/microposts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Post deleted successfully');
      // Remove the deleted post from the state to update the UI
      setMicroposts(microposts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  return (
    <div className='post-container'>
      <h2>{username}様の投稿したPosts</h2>
      <p>email:{email}</p>

      <ul>
      {microposts.map((post) => (
        <div className= "Posts_List_ul">
        <li key={post.id}>
          {/* Make sure to use the correct property name as defined in the serializer */}
          <p></p>
          <p>title <span>{post.title}</span></p>

          <p>post内容</p>
          <p>{post.body}</p>
          <button onClick={() => handleDelete(post.id)} className="button">
                削除する
          </button>
        </li>
        </div>
      ))}

      </ul>
      <div className='bottom'>
      <button onClick={handleHome} className="button">homeに戻る</button> 
      </div>
    </div>
  );
}

export default PostsList;