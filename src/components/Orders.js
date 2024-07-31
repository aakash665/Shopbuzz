import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/orders');
            setOrders(response.data);
        } catch (error) {
            setError('Error fetching orders');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <div className="orders-container">
            <h2>Order History</h2>
            <div className="orders-list">
                {orders.map((order) => (
                    <div className="order-card" key={order.id}>
                        <h3>Order ID: {order.id}</h3>
                        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                        <p>Total Amount: ${order.totalAmount}</p>
                        <p>Status: {order.status}</p>
                        <div className="order-items">
                            <h4>Items:</h4>
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <p>Product: {item.name}</p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
