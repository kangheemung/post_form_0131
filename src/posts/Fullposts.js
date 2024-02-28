import React, { useEffect, useState } from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import './Fullposts.css';  // Ensure this path correctly points to your CSS file
import { useAuth } from '../components/AuthContext'; // Make sure this path is correct

function Fullposts() {
    let { id, user_id } = useParams();
    const navigate = useNavigate();
    const [followedUserIds, setFollowedUserIds] = useState(new Set());
    const [microposts, setMicroposts] = useState([]);
    const { currentUser } = useAuth();  // Use useAuth here instead of useContext

    useEffect(() => {
        // Ensure there's a current user and a JWT token, if not redirect to login.
        if (!currentUser || !currentUser.jwtToken) {
            navigate('/api/v1/auth');
            return;
        }

        fetch('http://13.115.91.176:3000/api/v1/microposts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}` // Use currentUser.jwtToken here
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
            console.log(data);
            setMicroposts(data || []);
            // log just the data to inspect its structure

        })
        .catch(error => {
            console.error('Error fetching microposts:', error);
            navigate('/');
        });
    }, [currentUser, navigate]); // Depend on currentUser now

    const handleFollow = (userIdToFollow) => {
        if (!userIdToFollow) {
            console.error('User ID to follow is undefined');
            return;
        }
    
        fetch(`http://13.115.91.176:3000/api/v1/users/${userIdToFollow}/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to follow user.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Followed successfully:', data);
            setFollowedUserIds(new Set([...followedUserIds, userIdToFollow]));
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    };

    // アンフォローボタンを押した時の処理
    const handleUnfollow = (userIdToUnfollow) => {
        if (typeof userIdToUnfollow === 'undefined') {
            console.error('User ID to unfollow is undefined');
            return;
        }
        fetch(`http://13.115.91.176:3000/api/v1/users/${id}/unfollow`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to unfollow user.');
            }
            return response.json();
        })
        .then(data => {
            // アンフォロー後の状態更新や通知
            console.log(data.message);
        })
        .catch(error => {
            console.error('Error unfollowing user:', error);
        });
    };
    const handleHome = () => {
        navigate('/');
    };

    return (
        <div>
          <div>
            <ul>
                {microposts.map((post) => (

                    <li key={post.id.toString()}>
                       <div className="Posts_List">
                        <p>==================</p>
                        <p>Title:</p>
                        <span>{post.title}</span>
                        <p>Body:</p>
                        <p>{post.body}</p>
                        <p>Author: {post.name}</p>
                        <p>==================</p>
                        {currentUser && currentUser.id !== post.authorId && (
                          followedUserIds.has(post.authorId) ?
                        <button disabled>フォロワーしました</button> :
                        // Ensure you are using post.authorId if that's the correct property
                        <button onClick={() => handleFollow(post.authorId)}>
                            フォロー
                        </button>
                        )}

                        </div>
                    </li>
                ))}
            </ul>
            <div className='bottom'>
              <button className='button'onClick={handleHome}>Homeに戻る</button>
            </div>
          </div>
        </div>
    );
}

export default Fullposts;
