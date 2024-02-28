import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../components/AuthContext'; // Make sure this path is correct

function Fullposts() {
    const navigate = useNavigate();
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

    const handleHome = () => {
        navigate('/');
    };

    return (
        <div>
            <ul className="ul">
                {microposts.map((post) => (

                    <li key={post.id.toString()}>
                        <p>==================</p>
                        <p>Title:</p>
                        <span>{post.title}</span>
                        <p>Body:</p>
                        <p>{post.body}</p>
                        <p>Author: {post.name}</p>
                        <p>==================</p>
                    </li>
                ))}
            </ul>
            <button onClick={handleHome}>Homeに戻る</button>
        </div>
    );
}

export default Fullposts;
