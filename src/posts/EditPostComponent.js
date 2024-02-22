import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPostComponent() {
    let { id } = useParams();
    //let { user_id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', body: '' }); // Initialize with empty strings
    //testのため仮のトークンを入れます。本来ならいらないです。
    const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg2OTg2MzB9.GDkGHpRF0im2I0y2jll2RUki4VPsQivvAC-OF8Nvh1o"
    const user_id = 1;
    useEffect(() => {
        fetch(`http://43.206.238.35:3000/api/v1/users/${user_id}/microposts/${id}`)
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
            const response = await fetch(`http://43.206.238.35:3000/api/v1/users/${user_id}/microposts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    //jwt認証方法のため追加致しました。
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                navigate(`/api/v1/users/micropost/${id}`);
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
                    <textarea name="content" value={post.body} onChange={handleChange} />
                </label>
                <br />
                <button type="submit">更新</button>
            </form>
        </div>
  );
}

export default EditPostComponent;
