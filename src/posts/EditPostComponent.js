import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

function EditPostComponent() {
    const { user_id, id } = useParams(); // Destructure user_id and id from the URL parameters
    //let { user_id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({ title: '', body: '' }); // Initialize with empty strings
    //testのため仮のトークンを入れます。本来ならいらないです。
    //const jwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE3MDg3NTkyMTR9.IL8J7ngUjO5VPBJ4AoUOUWUGJzie_oS0JkoNePWBhVU"; // Your JWT token
    //const user_id = 1;
    const jwtToken = localStorage.getItem('token'); // Assumed jwtToken retrieval


    useEffect(() => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${jwtToken}`);

    // fetchメソッドの第二引数にheadersオブジェクトを追加します。
    fetch(`http://43.207.204.18:3000/api/v1/users/${user_id}/microposts/${id}`, { method: 'GET', headers: headers })

      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
            return Promise.reject(`Error! status: ${response.status}`);
        }
      })
      .then(data => {
        // confirm that data includes the fields 'title' and 'body'
        //フェッチされたデータからトークンを取り除くには、次のようにコードを変更します
        // Create a copy of the fetched post without the token property for logging
        //この変更により、token プロパティはログ出力から除外されますが、残りの投稿データはそのまま利用できます。上記のコードスニペットは、既存の useEffect コールバック内に適用すべきです。
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://43.207.204.18:3000/api/v1/users/${user_id}/microposts/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    //jwt認証方法のため追加致しました。
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(post),
            });

            if (response.ok) {
                navigate(`/api/v1/users/${user_id}/microposts/${id}`);
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
    //戻るボタンを押すとポストリストに戻ります。
    const handleBackClick = () => {
        navigate('/api/v1/users/${user_id}/microposts');
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
