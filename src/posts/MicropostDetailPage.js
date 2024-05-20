import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './MicropostDetailPage.css';

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
                setMicropost(data.data || {});
            })
            .catch(error => {
                console.error('Error fetching microposts:', error);
                navigate('/');
            });
        }
    }, [currentUser, navigate, setCurrentUser, id]);

    const handleBack = () => {
        window.history.back(); // Navigate to the previous page
    };


    if (!micropost) {
        return <div>Error: Failed to load micropost details</div>;
    }

    return (
        <div className='Microposts_Deatail'>
            <div className='Microposts_Deatail_box'>
                <p className='Microposts_Deatail_title'>タイトル：{micropost.title}</p>
                <div className="collapsible-content">
                    <p className='Microposts_Deatail_body'>内容：{micropost.body}</p>
                </div>
                <div className='Microposts_Deatail_box_button'>
                <button className='Microposts_Deatail_box_b_t_n' onClick={handleBack}>Back</button> {/* Back button */}
                </div>
            </div>
        </div>
    );
};

export default MicropostDetailPage;
