const express = require('express');
const { getWishlistItems, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

const router = express.Router();

router.get('/wishlist', getWishlistItems);

router.post('/wishlist', addToWishlist);

router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
