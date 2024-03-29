import { useState ,useEffect} from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { useNavigate } from 'react-router-dom';


function Newpost({ todos, setTodos}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userName, setUserName] = useState('');
  const [flashMessage, setFlashMessage] = useState(''); 
  const navigate = useNavigate();
  //let { user_id } = useParams();
//testのため仮のトークンを入れます。本来ならいらないです。
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"
  //const user_id = 1;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) {
      setFlashMessage('投稿内容を入力してください。');  // You can also use a state variable to show an error message
      return;
    }
    setFlashMessage('');
    // Retrieve the JWT token from local storage
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      console.error('No JWT Token found, user might not be logged in');
      return;
    }

    try {
      const decodedToken = jwtDecode(jwtToken);
      const user_id = decodedToken.user_id;
       // Instead of declaring userName here, just assign it
       setUserName(decodedToken.name);
      const postData = {
        title: title,
        body: body,
      };

      //console.log('Sending postData:', postData);
      const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${user_id}/microposts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      //console.log('Response data:', data);
      if (response.ok) {
        setUserName(data.user.name);
        navigate(`/users/${user_id}`);
      } else {
        throw new Error(`Error in creating post: ${data.message || "HTTP error! status: " + response.status}`);
      }
    } catch (error) {
      console.error('Failed to decode JWT or perform POST request:', error);
    }
  };
  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode(jwtToken);
        setUserName(decodedToken.name); // Set the username on load based on the JWT
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  }, []);
    return (
      <div className ="post_body">
         <div>
           <h2>{userName ? ` ${userName}` : ''}様の投稿ページ</h2>
         </div>
         {flashMessage && (
         <div className="flash-message">
           {flashMessage}
         </div>
       )}
          <form onSubmit={handleSubmit}>
            <div>
              <label className ="post-title">タイトル</label><br/>
              <input
                type="text"
                id="post-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="post-content">内容</label><br/>
              <textarea
                id="post-content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <button className="button" > 投稿！</button>
          </form>
        </div>
    );
  }
  export default Newpost;