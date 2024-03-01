import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Page() {
  let { id, user_id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const jwtToken = localStorage.getItem('token'); // Assumed jwtToken retrieval
  //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg2OTg2MzB9.GDkGHpRF0im2I0y2jll2RUki4VPsQivvAC-OF8Nvh1o"; // Your JWT token

  useEffect(() => {
    const url = `http://57.180.47.214:3000/api/v1/users/${user_id}/microposts/${id}`;
    fetch(url, {
      headers: {
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
      setPost(data.data); // Handle the case where data comes in without any problem.
    })
    .catch(error => {
      console.error('Error fetching post:', error);
      // Here you could set up state to display the error in your component,
      // like setting an error message in state and displaying it somewhere in your render.
    });
  }, [id, user_id,jwtToken]);

  const handleEdit = () => {
    // Navigate to the edit page for the post
    navigate(`/api/v1/users/${user_id}/micropost/${id}`);
  };
   //戻るボタンを押すとポストリストに戻ります。
   const handleBackClick = () => {
    navigate(`/api/v1/users/${user_id}`);
};


  return (
    <div >
      {/* Display the post based on the fetched data */}
      {post ? (
        <article>
          <p>投稿した内容</p>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <button onClick={handleEdit}>編集</button> {/* Add the edit button */}
        </article>
      ) : (
        <p>Loading...</p> // Provide feedback while loading or if no post is available
      )}
      <button className='button' type="button" onClick={handleBackClick}>postリストを見る</button>
    </div>
  );
}

export default Page;
