import { useState ,useEffect} from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { useNavigate } from 'react-router-dom';
import './Newpost.css';


function Newpost({ todos, setTodos}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userName, setUserName] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [titleCharacterCount, setTitleCharacterCount] = useState(0);
  const [bodyCharacterCount, setBodyCharacterCount] = useState(0);

  const navigate = useNavigate();
  const MAX_TITLE_LENGTH = 15;
  const MAX_BODY_LENGTH = 100;
  //let { user_id } = useParams();
//testのため仮のトークンを入れます。本来ならいらないです。
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"
  //const user_id = 1;

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_TITLE_LENGTH) {
      setTitle(inputValue);
      setTitleCharacterCount(inputValue.length);
    }
  };
  
  const handleBodyChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= MAX_BODY_LENGTH) {
      setBody(inputValue);
      setBodyCharacterCount(inputValue.length);
    }
  };
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
      <div className="post_body_main ">
  <div className="post_body_top">
    <p>{userName ? `${userName}様の投稿ページ` : ''}</p>
  </div>
  {flashMessage && (
    <div className="flash-message">
      {flashMessage}
    </div>
  )}
  <div className='new_post'>
    <form onSubmit={handleSubmit}>
      <label className='new_post_title'>タイトル(15文字以内まで)</label>
      <p className='new_post_body_Text'>{`現在の文字数: ${titleCharacterCount}/15`}</p>

      <div className='post_body_top'>
        <input
          type="text"
          id='post-title_box'
          value={title}
          onChange={handleTitleChange}
          maxLength={15} // Limit 'タイトル'
        />
      </div>
      <div className='new_post_body'>
        <label className='new_post_body_Text'>内容（100文字以内まで）</label>
        <p className='new_post_body_Text'>{`現在の文字数: ${bodyCharacterCount}/100`}</p>

        <div>
          <textarea
            id="post-main_box"
            value={body}
            onChange={handleBodyChange}
            maxLength={100}
            // Limit '内容' to 100 characters
          ></textarea>
        </div>
        <button className="post-button">投稿！</button>
      </div>
    </form>
  </div>
</div>


    );
  }
  export default Newpost;