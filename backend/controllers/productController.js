const db = require('../db'); 
const redis = require('../redis'); 

const fetchProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const cachedProduct = await redis.get(`product:${id}`);
        if (cachedProduct) {
            return res.json(JSON.parse(cachedProduct)); 
        }

        db.query(
            'SELECT * FROM products WHERE id = ?',
            [id],
            async (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching product details from DB' });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                const product = results[0];

                db.query(
                    'SELECT user, comment FROM reviews WHERE product_id = ?',
                    [id],
                    async (reviewErr, reviewResults) => {
                        if (reviewErr) {
                            return res.status(500).json({ message: 'Error fetching reviews' });
                        }

                        product.reviews = reviewResults; 
                        await redis.setex(`product:${id}`, 600, JSON.stringify(product));

                        res.json(product);
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { fetchProduct };
