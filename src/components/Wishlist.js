import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Wishlist.css';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/wishlist');
            setWishlist(response.data);
        } catch (error) {
            setError('Error fetching wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`/wishlist/${productId}`);
            setWishlist(wishlist.filter(item => item.id !== productId));
        } catch (error) {
            setError('Error removing item from wishlist');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (wishlist.length === 0) {
        return <p>Your wishlist is empty.</p>;
    }

    return (
        <div className="wishlist-container">
            <h2>Your Wishlist</h2>
            <div className="wishlist-cards">
                {wishlist.map((item) => (
                    <div className="wishlist-card" key={item.id}>
                        <img src={item.image} alt={item.name} className="wishlist-image" />
                        <div className="wishlist-details">
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price}</p>
                            <p>Description: {item.description}</p>
                            <button onClick={() => removeFromWishlist(item.id)} className="remove-button">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
