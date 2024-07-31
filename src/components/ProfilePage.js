import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/profile');
            setUser(response.data);
        } catch (error) {
            setError('Error fetching profile details');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-header">
                <h2>Profile</h2>
            </div>
            <div className="profile-details">
                <div className="profile-picture">
                    <img src={user.profilePicture} alt={user.name} />
                </div>
                <div className="profile-info">
                    <h3>{user.name}</h3>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    <p>Address: {user.address}</p>
                    <p>Joined: {new Date(user.joinedDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
