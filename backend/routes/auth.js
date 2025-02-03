const express = require('express');
const db = require('../db');
const redisClient = require('../redisClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'Key'; 

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const cachedUser = await redisClient.get(`user:${email}`);
        if (cachedUser) {
            const user = JSON.parse(cachedUser);
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, message: 'Login successful (cached)' });
        }

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            await redisClient.setEx(`user:${email}`, 1800, JSON.stringify(user));

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

            res.json({ token, message: 'Login successful' });
        });
    } catch (err) {
        console.error('Redis error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
