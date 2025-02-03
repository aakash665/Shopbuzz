const express = require('express');
const { fetchProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/profile', fetchProfile);

module.exports = router;
