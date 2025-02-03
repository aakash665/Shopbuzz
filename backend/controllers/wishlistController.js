const db = require('../db'); 
const redis = require('../redis'); 

const getWishlistItems = async (req, res) => {
    const userId = req.user.id; 

    try {
        const cachedWishlist = await redis.get(`wishlist:${userId}`);
        if (cachedWishlist) {
            return res.json(JSON.parse(cachedWishlist));
        }

        db.query(
            `SELECT w.id, p.name, p.description, p.price, p.imageUrl 
             FROM wishlist w 
             JOIN products p ON w.product_id = p.id 
             WHERE w.user_id = ?`,
            [userId],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching wishlist items' });
                }

                await redis.setex(`wishlist:${userId}`, 300, JSON.stringify(results));

                res.json(results);
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addToWishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        db.query(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            [userId, productId],
            async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error adding to wishlist' });
                }

                await redis.del(`wishlist:${userId}`);

                res.status(201).json({ message: 'Item added to wishlist' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromWishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        db.query(
            'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
            [userId, productId],
            async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error removing from wishlist' });
                }

                await redis.del(`wishlist:${userId}`);

                res.json({ message: 'Item removed from wishlist' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getWishlistItems, addToWishlist, removeFromWishlist };
