import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Fullposts.css';  // Ensure this path correctly points to your CSS file
import { useAuth } from '../components/AuthContext'; // Make sure this path is correct

function Fullposts() {
    const navigate = useNavigate();
    const [followedUserIds, setFollowedUserIds] = useState(new Set());
    const [microposts, setMicroposts] = useState([]);
    const { currentUser } = useAuth();  // Use useAuth here instead of useContext
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Ensure there's a current user and a JWT token, if not redirect to login.
        const storedFollowedUserIds = localStorage.getItem('followedUserIds');
        if (storedFollowedUserIds) {
            setFollowedUserIds(new Set(JSON.parse(storedFollowedUserIds)));
        }

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
            localStorage.setItem('followedUserIds', JSON.stringify([...new Set([...followedUserIds, userIdToFollow])]));
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
            setNotification('Invalid user ID.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
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
            if (response.status === 204 || response.ok) {
                console.log('Unfollowed successfully');
                setFollowedUserIds(prevFollowedUserIds => {
                    const updatedFollowedUserIds = new Set(prevFollowedUserIds);
                    updatedFollowedUserIds.delete(userIdToUnfollow);
                    localStorage.setItem('followedUserIds', JSON.stringify([...updatedFollowedUserIds]));
                    return updatedFollowedUserIds;
                });
                setNotification('Unfollowed successfully');
                setTimeout(() => {
                    setNotification('');
                }, 3000);
            } else {
                return response.json().then(data => {
                    let errorMessage = data.message || 'Failed to unfollow user.';
                    if (response.status === 404) {
                        errorMessage = 'Relationship not found. User may have been already unfollowed or never followed.';
                    }
                    throw new Error(errorMessage);
                });
            }
        })
        .catch(error => {
            console.error('Error unfollowing user:', error);
            if (error.message.includes('Relationship not found')) {
                setNotification('Cannot unfollow because the user was not followed.');
            } else {
                setNotification(error.message || 'Failed to unfollow user.');
            }
        });
    };
    const handleToggleFollow = (userId) => {
        if (followedUserIds.has(userId)) {
            handleUnfollow(userId);
        } else {
            handleFollow(userId);
        }
    };
    const handleHome = () => {
        navigate('/');
    };

    return (
        <div>
            {notification && <div className="notification">{notification}</div>}
            <ul>
                {microposts.map((post) => {
                    const authorId = post.user_id.toString();
                    const isAuthorCurrentUser = currentUser && String(currentUser.id) === authorId;

                    return (
                        <li key={post.id.toString()}>
                            <div className="Posts_List">
                                <div className='follow'>
                                    <p>投稿者: {post.name}</p>
                                    <p>
                                        {!isAuthorCurrentUser && (
                                            <button onClick={() => handleToggleFollow(authorId)}>
                                                {followedUserIds.has(authorId) ? 'フォローしました' : 'フォロー'}
                                            </button>
                                        )}
                                    </p>
                                </div>
                                <p>==================</p>
                                <p>Title:</p>
                                <span>{post.title}</span>
                                <p>Body:</p>
                                <p>{post.body}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <div className='bottom'>
                <button className='button' onClick={handleHome}>Homeに戻る</button>
            </div>
        </div>
    );
}

export default Fullposts;
