import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create the postData object using state variables
    const postData = {
      title: title,
      content: content,
    };



    // Perform the POST request to the server
    fetch('http://54.168.23.57:8080/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Additional code to handle success, such as resetting form or redirecting
      setTitle(''); // Reset title state
      setContent(''); // Reset content state
      if (data.id) {
        // Navigate to new URL using react-router-dom v6 syntax
        navigate(`/posts/${data.id}`);
      }
    })
    .catch((error) => console.error('Error:', error));
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Submit Post</button>
      </form>
    </div>
  );
}

export default NewPost;
