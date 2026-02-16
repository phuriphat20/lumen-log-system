const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 


router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({ isDel: false }).select('-password'); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;