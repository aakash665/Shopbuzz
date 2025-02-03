const db = require('../db'); 
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword],
                (insertErr) => {
                    if (insertErr) {
                        return res.status(500).json({ message: 'Error registering user' });
                    }
                    res.status(201).json({ message: 'Registration successful' });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser };
