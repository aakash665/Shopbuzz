const express = require('express');
const db = require('../db');
const redisClient = require('../redisClient');

const router = express.Router();

router.get('/search', async (req, res) => {
    const searchTerm = req.query.query;
    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {
        const cachedSearch = await redisClient.get(`search:${searchTerm}`);
        if (cachedSearch) {
            return res.json(JSON.parse(cachedSearch));
        }

        const query = `
            SELECT id, name, description, price, rating, stock
            FROM products
            WHERE name LIKE ? OR description LIKE ?`;

        db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`], async (err, results) => {
            if (err) {
                console.error('Error searching products:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            await redisClient.setEx(`search:${searchTerm}`, 300, JSON.stringify(results));

            res.json(results);
        });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
