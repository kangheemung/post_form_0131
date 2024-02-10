import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPostComponent() {
    let { id } = useParams();
    const navigate = useNavigate(); // Add this line to use the navigate function
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://54.168.23.57:8080/posts/${id}/edit`)
          .then(response => response.json())
          .then(data => {
            setPost(data); // Assuming your API returns the post data directly
          })
          .catch(error => {
            console.error('Error fetching post:', error);
          });
      }, [id]);
 // Function to handle the edit button click
    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would send a POST or PUT request to your API endpoint to update the post.
        // For this example, I'll just log to the console
        console.log(post);

        // After updating, navigate back to the post page
        navigate(`/posts/${id}`);
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value
        }));
    };
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
