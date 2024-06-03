import { useState ,useEffect} from 'react';
import {jwtDecode} from 'jwt-decode'; // Corrected import statement
import { useNavigate,useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Newpost.css';


function Newpost({ todos, setTodos}) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userName, setUserName] = useState('');
  const [flashMessage, setFlashMessage] = useState('');
  const [titleCharacterCount, setTitleCharacterCount] = useState(0);
  const [bodyCharacterCount, setBodyCharacterCount] = useState(0);
  const { currentUser ,setCurrentUser} = useAuth();

  const jwtToken = localStorage.getItem('token')
  let { user_id } = useParams();
  const navigate = useNavigate();
  const MAX_TITLE_LENGTH = 15;
  const MAX_BODY_LENGTH = 100;
  //let { user_id } = useParams();
//testのため仮のトークンを入れます。本来ならいらないです。
//const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"
//const user_id = 1;


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.jwtToken) {
          const decodedToken = jwtDecode(jwtToken);
          setUserName(decodedToken.name);
        }
      } catch (error) {
        console.error('Failed to decode JWT:', error);
      }
    };
    if (!jwtToken) {
      navigate('/auth'); // Redirect to login page if user is not logged in
    } else if (currentUser && user_id && Number(user_id) !== currentUser.id) {
      alert("You are trying to access an invalid URL. Please correct it.");
      navigate(`/users/${currentUser.id}/micropost`); // Redirect to the correct user's page
    } else {
      fetchData();
    }
  }, [currentUser,user_id, jwtToken, navigate,setCurrentUser]);

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
      setFlashMessage("Please enter your post content."); // Corrected string with escaped single quote
      return;
    }

    setFlashMessage('');

    const postData = {
      title: title,
      body: body,
    };

    const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${user_id}/microposts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(postData),
    });

    const data = await response.json();

    if (response.ok) {
      setUserName(data.user.name);
      navigate(`/users/${user_id}`);
    } else {
      throw new Error(`Error in creating post: ${data.message || "HTTP error! status: " + response.status}`);
    }
  };

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