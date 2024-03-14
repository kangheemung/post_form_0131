import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import './Fullposts.css';  // Ensure this path correctly points to your CSS file
import { useAuth } from '../components/AuthContext'; // Make sure this path is correct

function Fullposts() {
    const navigate = useNavigate();
    const [followedUserIds, setFollowedUserIds] = useState(new Set());
    const [microposts, setMicroposts] = useState([]);
    const { currentUser ,setCurrentUser} = useAuth();  // Use useAuth here instead of useContext
    const [notification, setNotification] = useState('');
    const [likedPosts, setLikedPosts] = useState(new Set());

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
    if (currentUser && currentUser.jwtToken) {
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/microposts`, {
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

      }
    }, [currentUser, navigate,setCurrentUser]); // Depend on currentUser now

    useEffect(() => {
        const storedLikedPosts = localStorage.getItem('likedPosts');
        if (storedLikedPosts) {
            setLikedPosts(new Set(JSON.parse(storedLikedPosts)));
        }
    }, []);

    // Event handler for liking a post
    const handleLike = (postId) => {;
        console.log('Attempting to like post with ID:', postId); // Check if postId is correct
        console.log('Current User:', currentUser);
        // Call your API endpoint to like a post
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/microposts/${postId}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.jwtToken}`
            }
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
            setLikedPosts((prevLikedPosts) => {
                const updatedLikedPosts = new Set(prevLikedPosts);
                updatedLikedPosts.add(postId);
                localStorage.setItem('likedPosts', JSON.stringify([...updatedLikedPosts]));
                return updatedLikedPosts;
              });
          })
        .catch(error => {
            console.error('Error liking post:', error);
            setNotification(error.message || 'Failed to like post.');
            setTimeout(() => {
                setNotification('');
            }, 3000);
        });
    };

    const handleFollow = (userIdToFollow) => {
        if (!userIdToFollow) {
            console.error('User ID to follow is undefined or invalid');
            return;
        }
        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${userIdToFollow}/follow`, {
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

        fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${userIdToUnfollow}/unfollow`, {
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

    // Event handler for unliking a post
    const handleUnlike = (postId) => {
        if (typeof postId === 'undefined') {
            console.error('Post ID is undefined');
            setNotification('Post ID is undefined.');
            setTimeout(() => {
              setNotification('');
            }, 3000);
            return;
          }
      console.log('Attempting to unlike post with ID:', postId);
      // Call your API endpoint to unlike a post
      fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/users/${currentUser.id}/microposts/${postId}/likes`, {
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
      .then(() => {
        console.log('Unliked successfully');
        setLikedPosts((prevLikedPosts) => {
          const updatedLikedPosts = new Set(prevLikedPosts);
          updatedLikedPosts.delete(postId);
          localStorage.setItem('likedPosts', JSON.stringify([...updatedLikedPosts]));
          return updatedLikedPosts;
        });
      })
      .catch(error => {
        console.error('Error unliking post:', error);
        setNotification(error.message || 'Failed to unlike post.');
        setTimeout(() => {
          setNotification('');
        }, 3000);
      });
    };

    // Updated handler for liking/unliking a post
    const handleToggleLike = (postId) => {
      if (likedPosts.has(postId)) {
        handleUnlike(postId);
      } else {
        handleLike(postId);
      }
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
                                    <p>投稿者: {post.user.name}</p>
                                    <p>
                                        {!isAuthorCurrentUser && (
                                            <button className="follow_btn"
                                            onClick={() => handleToggleFollow(authorId)}>
                                                {followedUserIds.has(authorId) ? 'フォローしました' : 'フォロー'}
                                            </button>
                                        )}
                                    </p>
                                </div>
                                <p>==================</p>
                                <div></div>
                                <p className = "top">タイトル</p>
                                <span>{post.title}</span>
                                <p className = "top">内容</p>
                                <p>{post.body}</p>
                                {!isAuthorCurrentUser && (
                                  <button className = "like_btn" onClick={() => handleToggleLike(post.id)}>
                                    {likedPosts.has(post.id) ? 'Likeしました' : 'Likeする'}
                                  </button>
                                )}
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
