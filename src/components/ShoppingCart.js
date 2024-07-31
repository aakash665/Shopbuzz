import React from 'react';
import '../styles/ShoppingCart.css';

const ShoppingCart = ({ cartItems, removeFromCart }) => {
    if (cartItems.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    return (
        <div className="shopping-cart-container">
            <h2>Shopping Cart</h2>
            <div className="cart-item-list">
                {cartItems.map((item) => (
                    <div className="cart-item-card" key={item.id}>
                        <div className="cart-item-image">
                            <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price}</p>
                            <p>Rating: {item.rating}</p>
                            <p>Stock: {item.stock}</p>
                            <button onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShoppingCart;
