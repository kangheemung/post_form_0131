import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPostComponent() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', content: '' }); // Initialize with empty strings

    useEffect(() => {
        fetch(`http://54.168.23.57:8080/posts/${id}`)
          .then(response => response.json())
          .then(data => {
            setPost(data); // Assuming your API returns the post data directly
          })
          .catch(error => {
            console.error('Error fetching post:', error);
          });
      }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch(`http://54.168.23.57:8080/posts/${id}/edit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                navigate(`/posts/${id}`);
            } else {
                const errorData = await response.json();
                console.error('Failed to update post:', errorData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };

    if (!post) {
        return <p>Loading...</p>; // Render a loading state or similar message
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
                    <textarea name="content" value={post.content} onChange={handleChange} />
                </label>
                <br />
                <button type="submit">更新</button>
            </form>
        </div>
  );
}

export default EditPostComponent;
