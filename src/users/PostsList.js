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
      const url = `http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${id}/`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
          },
        });
        const result = await response.json();
        console.log(result); // Logs the API response for debugging
        if (response.ok) {
          setUsername(result.user.name);
          setEmail(result.user.email);
          setMicroposts(result.data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Fetching user data error:", error);
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
    <>
    <div className="myPosts_top">
      <h2>{username}様の投稿したPosts</h2>
      <p>email:{email}</p>
    </div>
    <div className='post-container'>
      {/* The <ul> tag should start here and not inside the map function */}
      <ul className='post-list'>
        {microposts && microposts.map((post) => (
          // The key should be on the <li> element, not on a div wrapper.
          <li key={post.id} className="post-list-item">
            {/* Title and content */}
            <p>title: <span>{post.title}</span></p>
            <p>post内容: {post.body}</p>

            {/* Delete button */}
            <button className='button' onClick={() => handleDelete(post.id)} >
              削除
            </button>
          </li>
        ))}
      </ul> {/* The </ul> tag should end after the map function */}
    </div>

    {/* Footer with back button */}
    <div className='bottom'>
      <button onClick={handleHome} className="button">homeに戻る</button>
    </div>
  </>
  );
}

export default PostsList;