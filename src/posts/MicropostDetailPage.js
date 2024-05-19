import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const MicropostDetailPage = () => {
    const { id } = useParams();
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [micropost, setMicropost] = useState(null);

    useEffect(() => {
        const jwtToken = localStorage.getItem('jwtToken');

        if (!currentUser && jwtToken) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setCurrentUser(userData);
            }
        } else if (!jwtToken) {
            navigate('/api/v1/auth'); 
            return;
        }

        if (currentUser && currentUser.jwtToken) {
            fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/microposts/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.jwtToken}`
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
                console.log(data); // Check the structure of the data
                setMicropost(data.data || {}); // Set micropost data to the 'data' property
            })
            .catch(error => {
                console.error('Error fetching microposts:', error);
                navigate('/');
            });
        }
    }, [currentUser, navigate, setCurrentUser, id]);

    if (!micropost) {
        return <div>Error: Failed to load micropost details</div>;
    }

    return (
        <div>
            <h2>タイトル：{micropost.title}</h2>
            <p>内容：{micropost.body}</p> {/* Assuming 'body' contains the content */}
        </div>
    );
};

export default MicropostDetailPage;
