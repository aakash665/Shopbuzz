import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.css';

const ProductPage = ({ addToCart }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/product/${id}`);
            setProduct(response.data);
        } catch (error) {
            setError('Error fetching product details');
        }
    };

    const handleBuy = async () => {
        // Implement buy functionality here
        alert(`Product ${id} bought!`);
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="product-page-container">
            <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="product-details">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Rating: {product.rating}</p>
                <p>Stock: {product.stock}</p>
                <div className="product-reviews">
                    <h3>Reviews</h3>
                    {product.reviews.map((review, index) => (
                        <div key={index} className="review">
                            <p><strong>{review.user}</strong></p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>
                <div className="product-actions">
                    <button onClick={() => addToCart(product.id)}>Add to Cart</button>
                    <button onClick={handleBuy}>Buy</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
