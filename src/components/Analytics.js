import React, { useEffect, useState } from 'react';
import '../styles/Analytics.css'; // Import the CSS file for Analytics

const Analytics = () => {
    const [data, setData] = useState({
        totalSales: 0,
        totalVolume: 0,
        totalOrders: 0
    });

    useEffect(() => {
        // Fetch analytics data from the backend
        const fetchData = async () => {
            try {
                const response = await fetch('/api/analytics');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="analytics">
            <h1>Analytics Dashboard</h1>
            <div className="analytics-card">
                <h2>Total Sales</h2>
                <p>${data.totalSales.toFixed(2)}</p>
            </div>
            <div className="analytics-card">
                <h2>Total Volume</h2>
                <p>{data.totalVolume} items</p>
            </div>
            <div className="analytics-card">
                <h2>Total Orders</h2>
                <p>{data.totalOrders}</p>
            </div>
        </div>
    );
};

export default Analytics;
