const express = require('express');
const db = require('../db');
const redisClient = require('../redisClient');

const router = express.Router();

router.get('/home', async (req, res) => {
    try {
        const cachedProducts = await redisClient.get('all_products');
        if (cachedProducts) {
            return res.json(JSON.parse(cachedProducts));
        }

        const query = 'SELECT id, name, description, price, rating, stock FROM products';
        db.query(query, async (err, results) => {
            if (err) {
                console.error('Error fetching products:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            await redisClient.setEx('all_products', 600, JSON.stringify(results));

            res.json(results);
        });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
