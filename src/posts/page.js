import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//Data fetching

//1. server Side Renderinf(SSR)
//2/ static Site Generation(SSG)
//3. Incremental Static Generation (ISR)

// /posts/new

function Page(){
    let { id } = useParams();
    const navigate = useNavigate(); // Add this line to use the navigate function
    const [post, setPost] = useState(null);
  
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
 // Function to handle the edit button click
    const handleEdit = () => {
        // Navigate to the edit page for the post
        navigate(`/posts/${id}/edit`);
    };
    return (
       <div>
      {/* Display the post based on the fetched data */}
      {post && (
        <article>
            <p>投稿した内容</p>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <button onClick={handleEdit}>編集</button> {/* Add the edit button */}
        </article>
      )}
    </div>
  )
}

export default Page;
