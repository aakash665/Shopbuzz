import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ isLoggedIn }) => {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/analytics">Analytics</Link></li>
                        <li><a href="/logout" className="nav-link">Logout</a></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
