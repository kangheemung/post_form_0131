import { useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { useNavigate } from 'react-router-dom';


function Newpost({ todos, setTodos}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  //let { user_id } = useParams();
//testのため仮のトークンを入れます。本来ならいらないです。
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"
  //const user_id = 1;
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve the JWT token from local storage
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      console.error('No JWT Token found, user might not be logged in');
      return;
    }

    try {
      const decodedToken = jwtDecode(jwtToken);
      const user_id = decodedToken.user_id;
      const postData = {
        title: title,
        body: body,
      };

      console.log('Sending postData:', postData);
      const response = await fetch(`http://54.250.241.126:3000/api/v1/users/${user_id}/microposts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //console.log('Response data:', data);

      if (data.status === 201 && data.data?.id) {
        navigate(`/api/v1/users/${user_id}/microposts/${data.data.id}`);
      } else {
        throw new Error('Error in creating post');
      }
    } catch (error) {
      console.error('Failed to decode JWT or perform POST request:', error);
    }
  };
    return (
      <div>
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="post-title">Title:</label><br/>
            <input
              type="text"
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="post-content">Content:</label><br/>
            <textarea
              id="post-content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <button type="submit">Submit Post</button>
        </form>
      </div>
    );
  }
  export default Newpost;