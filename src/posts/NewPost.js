import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Newpost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  //let { user_id } = useParams();
//testのため仮のトークンを入れます。本来ならいらないです。
  const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg2OTg2MzB9.GDkGHpRF0im2I0y2jll2RUki4VPsQivvAC-OF8Nvh1o"
  const user_id = 1;
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the postData object using state variables
    const postData = {
      title: title,
      body: body,
    };


    // Perform the POST request to the server
    fetch(`http://43.206.238.35:3000/api/v1/users/${user_id}/microposts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //jwt認証方法のため追加致しました。
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 201 && data.data?.id) {
        navigate(`/api/v1/users/${user_id}/microposts/${data.data.id}`);
      } else {
        throw new Error('Error in creating post');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
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
