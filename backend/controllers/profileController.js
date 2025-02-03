const db = require('../db'); 
const redis = require('../redis'); 

const fetchProfile = async (req, res) => {
    const userId = req.user.id; 
    try {
        const cachedProfile = await redis.get(`profile:${userId}`);
        if (cachedProfile) {
            return res.json(JSON.parse(cachedProfile));
        }

        db.query(
            'SELECT name, email, phone, address, profilePicture, joinedDate FROM users WHERE id = ?',
            [userId],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching profile details' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const userProfile = results[0];

                await redis.setex(`profile:${userId}`, 600, JSON.stringify(userProfile));

                res.json(userProfile);
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { fetchProfile };
