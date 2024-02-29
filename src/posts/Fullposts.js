import React, { useEffect, useState } from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import './Fullposts.css';  // Ensure this path correctly points to your CSS file
import { useAuth } from '../components/AuthContext'; // Make sure this path is correct

function Fullposts() {
    let { id } = useParams();
    const navigate = useNavigate();
    const [followedUserIds, setFollowedUserIds] = useState(new Set());
    const [microposts, setMicroposts] = useState([]);
    const { currentUser } = useAuth();  // Use useAuth here instead of useContext
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Ensure there's a current user and a JWT token, if not redirect to login.
        if (!currentUser || !currentUser.jwtToken) {
            navigate('/api/v1/auth');
            return;
        }

        fetch('http://54.250.241.126:3000/api/v1/microposts', {
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
            console.error('User ID to follow is undefined or invalid');
            return;
        }
        fetch(`http://54.250.241.126:3000/api/v1/users/${userIdToFollow}/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            },
            // Include the body with the relationship object containing followed_id
            body: JSON.stringify({
                relationship: { followed_id: userIdToFollow } 
            })
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

            // Optionally, set a notification message for the user interface
            setNotification('Followed successfully');

            // Trigger any necessary re-render or state updates to reflect the change
            setTimeout(() => {
                setNotification('');
            }, 3000); // Clear notification after 3 seconds
        })
        .catch(error => {
            console.error('Error following user:', error);
            setNotification(error.message || 'Failed to follow user.');
            // Also clear this notification after some time
            setTimeout(() => {
                setNotification('');
            }, 3000);
        });
    };

    // アンフォローボタンを押した時の処理
    const handleUnfollow = (userIdToUnfollow) => {
        if (typeof userIdToUnfollow === 'undefined') {
            console.error('User ID to unfollow is undefined');
            return;
        }
        fetch(`http://54.250.241.126:3000/api/v1/users/${userIdToUnfollow}/unfollow`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    console.error('Server responded with an error:', data);
                    throw new Error(data.message || 'Failed to follow user.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Unfollowed successfully:', data);
            setFollowedUserIds(prevFollowedUserIds => {
                const updatedFollowedUserIds = new Set(prevFollowedUserIds);
                updatedFollowedUserIds.delete(userIdToUnfollow);
                return updatedFollowedUserIds;
            });
        })
        .catch(error => {
            console.error('Error following/unfollowing user:', error.message);
        });
    };
    const handleHome = () => {
        navigate('/');
    };

    return (
        <div>
          <div>
            <ul>
            {microposts.map((post) => {
                    const authorId = post.user_id; // Update the variable to match the actual field name
                    const shouldRenderFollowButton = currentUser && currentUser.id !== authorId;
                    const hasBeenFollowed = followedUserIds.has(authorId);
                    const isAuthorCurrentUser = currentUser && String(currentUser.id) === String(authorId);
                    console.log('Post ID:', post.id, 'Author ID:', authorId);
                    console.log('Rendering Follow Button:', shouldRenderFollowButton && !hasBeenFollowed);
                return (
                    <li key={post.id.toString()}>
                        <div className="Posts_List">
                            <p>==================</p>
                            <p>Title:</p>
                            <span>{post.title}</span>
                            <p>Body:</p>
                            <p>{post.body}</p>
                            <p>Author: {post.name}</p>
                            <p>==================</p>

                            {!isAuthorCurrentUser && (
                                hasBeenFollowed ? (
                                    <button disabled>フォロワーしました</button> // Button shows followed status
                                ) : (
                                    <button onClick={() => handleFollow(authorId)}>
                                        フォロー
                                    </button>
                                )
                            )}
                        </div>
                    </li>
                );
            })}
            </ul>
            <div className='bottom'>
              <button className='button'onClick={handleHome}>Homeに戻る</button>
            </div>
          </div>
        </div>
    );
}

export default Fullposts;
