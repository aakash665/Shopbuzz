import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/home');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/search?query=${searchTerm}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const handleBuy = async (productId) => {
        // Implement buy functionality here
        alert(`Product ${productId} bought!`);
    };

    return (
        <div className="home-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="product-list">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Price: ${product.price}</p>
                        <p>Rating: {product.rating}</p>
                        <p>Stock: {product.stock}</p>
                        <button onClick={() => handleBuy(product.id)}>Buy</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
