const express = require('express');
const { getCartItems, addToCart, removeFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/cart', getCartItems);

router.post('/cart', addToCart);

router.delete('/cart/:productId', removeFromCart);

module.exports = router;
