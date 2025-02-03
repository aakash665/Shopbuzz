const express = require('express');
const db = require('../db');
const redisClient = require('../redisClient');

const router = express.Router();

router.get('/orders', async (req, res) => {
    try {
        const userId = req.query.userId; 
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const cacheKey = `orders:${userId}`;

        const cachedOrders = await redisClient.get(cacheKey);
        if (cachedOrders) {
            return res.json(JSON.parse(cachedOrders));
        }

        const query = `
            SELECT o.id, o.date, o.totalAmount, o.status, 
                   oi.productName AS name, oi.quantity, oi.price 
            FROM orders o
            JOIN order_items oi ON o.id = oi.orderId
            WHERE o.userId = ?`;

        db.query(query, [userId], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.json([]);
            }

            const ordersMap = {};
            results.forEach(row => {
                if (!ordersMap[row.id]) {
                    ordersMap[row.id] = {
                        id: row.id,
                        date: row.date,
                        totalAmount: row.totalAmount,
                        status: row.status,
                        items: []
                    };
                }
                ordersMap[row.id].items.push({
                    name: row.name,
                    quantity: row.quantity,
                    price: row.price
                });
            });

            const orders = Object.values(ordersMap);

            await redisClient.setEx(cacheKey, 1800, JSON.stringify(orders));

            res.json(orders);
        });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
