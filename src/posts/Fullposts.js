import React, { useEffect, useState } from 'react';
import {useNavigate ,Link } from 'react-router-dom';
import './Fullposts.css';  // Ensure this path correctly points to your CSS file
import { useAuth } from '../components/AuthContext'; // Make sure this path is correct

function Fullposts() {
    const navigate = useNavigate();
    const [followedUserIds, setFollowedUserIds] = useState(new Set());
    const [microposts, setMicroposts] = useState([]);
    const { currentUser ,setCurrentUser} = useAuth();
    const [notification, setNotification] = useState('');
    const [likedPosts, setLikedPosts] = useState(new Set());
    let userIdToFollow;
    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');
        // currentUserを復元するための処理を追加
        if (!currentUser && jwtToken) {
            // JWTトークンからユーザー情報を取得するためのAPIコールか、
            // またはローカルストレージから直接ユーザー情報を取得します。
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                // この部分で、userDataの内容を確認し、currentUserにセットするロジックを入れます。
                setCurrentUser(userData); // useAuthフックで提供される関数を使ってcurrentUserを更新
            }
        } else if (!jwtToken) {
            navigate('/api/v1/auth'); // Make sure this path leads to your login page
            return;
        }

        // Ensure there's a current user and a JWT token, if not redirect to login.
        if (currentUser && currentUser.jwtToken) {
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/microposts`, {
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
            setMicroposts(data.data || []);
            const updatedFollowedUserIds = new Set(data.data.filter(post => post.followed_by_current_user).map(post => post.user_id.toString()));
            setFollowedUserIds(updatedFollowedUserIds);
            localStorage.setItem('followedUserIds', JSON.stringify(Array.from(updatedFollowedUserIds)));
            const updatedLikedPosts = new Set(data.data.filter(post => post.liked_by_current_user).map(post => post.id.toString()));
            setLikedPosts(updatedLikedPosts);
            localStorage.setItem('likedPosts', JSON.stringify(Array.from(updatedLikedPosts)));
            })
        .catch(error => {
            console.error('Error fetching microposts:', error);
            navigate('/');
        });
     };

    }, [currentUser]);



    const handleLike = async (postId) => {
        console.log('Attempting to like post with ID:', postId);
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/microposts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            },
            body: JSON.stringify({
                like: {
                    user_id: currentUser.id,
                    micropost_id: postId
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to like post.');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Liked successfully:', data);
            const updatedLikedPosts = new Set([...likedPosts]); // Assuming likedPosts is the current state
            updatedLikedPosts.add(postId);
            localStorage.setItem('likedPosts', JSON.stringify([...updatedLikedPosts]));
            setLikedPosts(updatedLikedPosts);
            })
        .catch(error => {
            console.error('Error liking post:', error);
            setNotification(error.message || 'Failed to like post.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
        });
    };



    const handleUnlike = async (postId) => {
        console.log('Attempting to unlike post with ID:', postId);
        // Update the API endpoint to the correct unliking endpoint
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/microposts/${postId}/unlike`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
              return response.json().then(data => {
                throw new Error(data.message || 'Failed to unlike post.');
              });
            }
            return response.text();
          })
          .then(data => {
            localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, postId]));
            console.log('Followed successfully:', data);
            setLikedPosts(new Set([...likedPosts].filter(id => id !== postId)));

            // Optionally, set a notification message for the user interface
            setNotification('Followed successfully');

            // Trigger any necessary re-render or state updates to reflect the change
            setTimeout(() => {
                setNotification('');
            }, 3000); // Clear notification after 3 seconds
        })
        .catch(error => {
            console.error('Error unliking post:', error);
            setNotification(error.message || 'Failed to unlike post.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
        });
        console.log('Attempting to unlike post with ID:', postId);
    };

    const handleToggleFollow = (userIdToFollow) => {
        if (!userIdToFollow) {
            console.error('User ID to follow is undefined or invalid');
            return;
        }
        const followedByCurrentUser = followedUserIds.has(userIdToFollow);
        const buttonText = followedByCurrentUser ? 'followed' : 'follow!';
        if (followedByCurrentUser) {
            handleUnfollow(userIdToFollow);
        } else {
            handleFollow(userIdToFollow);
        }
    };
    const handleToggleLike = (postId) => {
        if (likedPosts.has(postId)) {
          handleUnlike(postId);
        } else {
          handleLike(postId);
        }
      };

    const handleFollow = (userIdToFollow) => {
        if (!currentUser) {
            console.error('User ID to follow is undefined or invalid');
            return;
        }
        const relationshipData = {
                relationship: {  followed_id: currentUser.id, follower_id: userIdToFollow }
        }
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/follow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            },
            // Include the body with the relationship object containing followed_id
            body: JSON.stringify(relationshipData)
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
            const updatedFollowedUserIds = new Set([...followedUserIds]);
            updatedFollowedUserIds.add(userIdToFollow);
            localStorage.setItem('followedUserIds', JSON.stringify(Array.from(updatedFollowedUserIds)));
            setFollowedUserIds(updatedFollowedUserIds);
            setNotification('Followed successfully')
                // Update button text after successful follow
            const updatedButton = document.querySelector('.follow_btn');
            if (updatedButton) {
                updatedButton.textContent = 'followed';
            }

        })
        .catch(error => {
            console.error('Error liking/unliking post:', error);
            setNotification(error.message || 'Failed to perform the action.');
            setTimeout(() => {
                setNotification('');
            }, 3000); // Clear notification after 3 seconds
        });
    };
    // アンフォローボタンを押した時の処理
    const handleUnfollow = (userIdToUnfollow) => {
        console.log('Attempting to unfollow user with ID:', userIdToUnfollow);
        if (!userIdToUnfollow) {
            console.error('User ID to unfollow is undefined');
            return;
        }
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/unfollow`, {
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
                    // Update button text after successful unfollow
                const updatedButton = document.querySelector('.follow_btn');
                if (updatedButton) {
                    updatedButton.textContent = 'follower!';
                }
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
            console.error('Error toggling follow:', error);
            setNotification(error.message || 'Failed to toggle follow status.');
            setTimeout(() => {
                setNotification('');
            }, 3000); // Clear notification after 3 seconds
        });
    };




    return (
        <>
            <div className="fullposts-container-body">
                <div className="post-container_t">
                    <h1>投稿された記録</h1>
                </div>
                {microposts && microposts.length > 0 ? (
                <div className="posts-grid-body">
                    {microposts.map((post) => {
                                    const isAuthorCurrentUser = currentUser && currentUser.id === post.user_id;
                                    return (
                                <div className="post-list-item" key={post.id}>
                                    <div className='name_box'>
                                    <p className='author-and-follow_name'>投稿者: {post.name ? post.name : 'Unknown User'}</p>
                                        {!isAuthorCurrentUser && (
                                          <button className="follow_btn" onClick={() => handleToggleFollow(post.user_id)}>
                                              {post.followed_by_current_user ? 'followed' : 'follow!'} 
                                          </button>
                                        )}
                                    </div>
                                    <p className="post_top">タイトル: {post.title}</p>
                                    {post.body.length <= 100 && (
                                        <p className="post-body">{post.body}</p>
                                    )}
                                    <div>
                                    <div className='like'>
                                      {!isAuthorCurrentUser && (
                                     <button className = "like_btn" onClick={() => handleToggleLike(post.id)}>
                                     {post.liked_by_current_user ? 'Liked' : 'Like!'}
                                   </button>
                                    )}
                                    </div>
                                    </div>
                                    <div className="fullposts_detail_button">
                                        <Link to={`/microposts/${post.id}`} className='fullposts_detail_link'>
                                            詳細
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className='noposts' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <p>No posts available.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Fullposts;