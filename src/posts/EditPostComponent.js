import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPostComponent() {
    const { id, user_id } = useParams(); // Destructure user_id and id from the URL parameters
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', body: '' }); // Initialize with empty strings
    //testのため仮のトークンを入れます。本来ならいらないです。
    //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Your JWT token
    //const user_id = 1;
    const jwtToken = localStorage.getItem('token'); // Assumed jwtToken retrieval

    useEffect(() => {
        fetch(`http://57.181.27.121.35:3000/api/v1/users/${user_id}/microposts/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
        })
        .then(data => {
          // Log the fetched post data
          const { data: postData } = data;
          console.log('Fetched post:', postData);
          setPost({
              title: postData.title || '',
              body: postData.body || ''
          });
      })
      .catch(error => {
          console.error('Error fetching post:', error);
      });
    }, [user_id, id, jwtToken]); // useEffectの依存配列にuser_idを追加
  // useEffectの依存配列にuser_idを追加

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://57.181.27.121:3000/api/v1/users/${user_id}/microposts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    //jwt認証方法のため追加致しました。
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                navigate(`/api/v1/users/${user_id}`);
            } else {
                const errorData = await response.json();
                console.error('Failed to update post:', errorData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
        // Function to handle the back button click
        const handleBackClick = () => {
            navigate(`/api/v1/users/${user_id}`);
        };

        const handleChange = (event) => {
            const { name, value } = event.target;
            setPost(prevPost => ({
                ...prevPost,
                [name]: value
            }));
        };


    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {/* Display the edit form with current post data */}
            <form onSubmit={handleSubmit}>
                <p>投稿の編集</p>
                <label>
                    Title:
                    <input type="text" name="title" value={post.title} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Content:
                    <textarea name="body" value={post.body} onChange={handleChange} />
                </label>
                <br />
                <button type="submit">更新</button>
            </form>

            <button type="button" onClick={handleBackClick}>postリストを見る</button>
        </div>
  );
}

export default EditPostComponent;
