const db = require('../db'); 
const redis = require('../redis'); 

const getCartItems = async (req, res) => {
    const userId = req.user.id; 

    try {
        const cachedCart = await redis.get(`cart:${userId}`);
        if (cachedCart) {
            return res.json(JSON.parse(cachedCart));
        }

        db.query(
            `SELECT c.id, p.name, p.description, p.price, p.rating, p.stock, p.imageUrl
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching cart items' });
                }

                await redis.setex(`cart:${userId}`, 300, JSON.stringify(results));

                res.json(results);
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        db.query(
            'INSERT INTO cart (user_id, product_id) VALUES (?, ?)',
            [userId, productId],
            async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error adding to cart' });
                }

                await redis.del(`cart:${userId}`);

                res.status(201).json({ message: 'Item added to cart' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId],
            async (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error removing from cart' });
                }

                await redis.del(`cart:${userId}`);

                res.json({ message: 'Item removed from cart' });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCartItems, addToCart, removeFromCart };
