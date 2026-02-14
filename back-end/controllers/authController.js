const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, isDel: false });

        if (!user || password !== `${user.username}123`) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                level: user.level
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, level: user.level });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};