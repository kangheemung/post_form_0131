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
            setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
        } else if (!jwtToken) {
            navigate('/auth');
            return;
        }
        if (currentUser && currentUser.jwtToken) { const fetchData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                };
                const response = await fetch(`http://${process.env.REACT_APP_API_URL}:3000/api/v1/microposts/${id}`, {
                    method: 'GET',
                    headers: headers
                });
                if (response.ok) {
                    const data = await response.json();
                    setMicropost(data.data || {});
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching microposts:', error);
                // Handle error or display a message to the user
            }
        };

        if (!currentUser) {
            setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
        } else {
            fetchData();
        }
    }
    }, [currentUser, id, navigate, setCurrentUser]);

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
                    <p className='Microposts_Deatail_body'>{micropost.body}</p>
                </div>
                <div className='Microposts_Deatail_box_button'>
                    <button className='Microposts_Deatail_box_b_t_n' onClick={handleBack}>Back</button> {/* Back button */}
                </div>
            </div>
        </div>
    );
};

export default MicropostDetailPage;
