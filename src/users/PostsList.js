import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './PostsList.css';
function PostsList() {
  const [microposts, setMicroposts] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { currentUser ,setCurrentUser} = useAuth();
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Replace with actual JWT token
  //const user_id = 1; // Replace with actual user ID
  const jwtToken = localStorage.getItem('token')
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (!currentUser && jwtToken) {
        setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
    } else if (currentUser && id !== String(currentUser.id)) {
      // Redirect to appropriate URL or display an error message
      alert("You are trying to access an invalid URL. Please correct it.");
      navigate(`/users/${id}`); // Redirect to home or another suitable page
    }
    else if (!jwtToken) {
        navigate('/auth');
        return;
    }
    if (currentUser && currentUser.jwtToken) {
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
        setMicroposts(result.data);
        setUsername(result.user ? result.user.name : '');
        setEmail(result.user ? result.user.email : '');
      } catch (error) {
        console.error("Fetching microposts error:", error);
        setError('Failed to load microposts. Please check your connection and try again.');
      }
    };

      fetchMicroposts();
    }
  }, [id, jwtToken, navigate, currentUser, setCurrentUser]);

  const handleHome = () => {
    navigate('/microposts'); // Navigate back to home
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
      setMicroposts(prevMicroposts => prevMicroposts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Fetching microposts error:", error);
    }
  };


  return (
      <>
      {microposts && (
        <div className='post-container_body'>
          <div className='post-container_t'>
            <h1>あなたが投稿した内容</h1>
          </div>
          <div className='Posts_List_ul'>
            {microposts.map((post) => (
              <div key={post.id} className='post_box'>
                <p className="post_box_t_b">title --{post.title}--</p>
                <p className="post_box_p">{post.body}</p>
                <button onClick={() => handleDelete(post.id)} className="p_button">
                  削除
                </button>
                <div className='mypost_bottom_detail'>
                  <Link to={`/microposts/${post.id}`} className="detail-link">
                    詳細
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className='p_submit_box_bottom'>
            <button className='p_submit_box' onClick={handleHome}>
              みんなのポスト見に行く！
            </button>
          </div>
        </div>
      )}
      {!microposts && (
        <div className='post-container_body'>
          <div className='post-container_t'>
            <h1>あなたが投稿した内容</h1>
          </div>
          <p>No posts available.</p>
          <div className='p_submit_box_bottom'>
            <button className='p_submit_box' onClick={handleHome}>
              みんなのポスト見に行く！
            </button>
          </div>
        </div>
      )}
    </>
   );
  }
  

export default PostsList;