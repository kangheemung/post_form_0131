import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostsList.css';
function PostsList() {
  const [microposts, setMicroposts] = useState(null);

  const [error, setError] = useState(null);
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
          const errorBody = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();

        setMicroposts(result.data || []);
      } catch (error) {
        console.error("Fetching microposts error:", error);
        setError('Failed to load microposts. Please check your connection and try again.');
      }
    };

    fetchMicroposts();
  }, [id, jwtToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }


  const handleHome = () => {
    navigate('/'); // Navigate back to home
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${id}/microposts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //console.log('Post deleted successfully');
      // Remove the deleted post from the state to update the UI
      setMicroposts(microposts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  return (
    <div className='post-container'>
    {microposts ? (
      microposts.length > 0 ? (
        <div className='Posts_List_ul'>

          {microposts.map((post) => (
            <li key={post.id}>
              <p>title <span>{post.title}</span></p>
              <p>post内容</p>
              <p>{post.body}</p>
              <button onClick={() => handleDelete(post.id)} className="button">
                削除
              </button>
            </li>
          ))}

        </div>
      ) : (
        <p>投稿ポストがないです</p>
      )
    ) : (
      <p>Loading...</p>
    )}


      <button className='button'onClick={handleHome} >home</button>

  </div>
  );
}

export default PostsList;