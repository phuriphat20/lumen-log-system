const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ 
            username: username.toLowerCase(), 
            isDel: false 
        });

        if (!user) {
            console.log(`Login failed: User ${username} not found`);
            return res.status(401).json({ msg: 'Authentication failed. Please check your credentials.' });
        }

        if (password !== `${user.username}123`) {
            console.log(`Login failed: Incorrect password for ${username}`);
            return res.status(401).json({ msg: 'Authentication failed. Please check your credentials.' });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment variables!");
            return res.status(500).json({ msg: 'Server configuration error' });
        }

        const token = jwt.sign(
            { id: user._id, level: user.level },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            level: user.level, 
            userId: user._id,
            username: user.username 
        });
        
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};