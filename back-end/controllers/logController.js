const Log = require('../models/Log');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getLogs = async (req, res) => {
    try {
        const {
            action, startDate, endDate, userId,
            statusCode, labnumber, minTime, maxTime,
            sortBy, order, page = 1, limit = 50
        } = req.query;

        let query = {};

        // Action Filter 
        if (action && action !== 'all' && action !== '') {
            const actionArray = Array.isArray(action) ? action : action.split(',');
            query.action = { $in: actionArray.map(a => new RegExp(`^${a}$`, 'i')) };
        }
        // Date Range
        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        let queryUserId = {};

        const activeUsers = await User.find({ isDel: false }).select('_id');
        const activeUserIds = activeUsers.map(u => u._id.toString());
        let selectedIds = [];

        if (userId && userId !== 'all' && userId !== '') {
            selectedIds = Array.isArray(userId) ? userId : userId.split(',');
        }

        if (selectedIds.length > 0) {
            const validObjectIds = selectedIds
                .filter(id => activeUserIds.includes(id) && mongoose.Types.ObjectId.isValid(id))
                .map(id => new mongoose.Types.ObjectId(id));
            query.userId = { $in: validObjectIds };
        } else {

            query.userId = { $in: activeUserIds.map(id => new mongoose.Types.ObjectId(id)) };
        }
        // StatusCode & LabNumber
        if (statusCode) {
            query['response.statusCode'] = Number(statusCode);
        }
        if (labnumber) {
            query.labnumber = { $regex: labnumber, $options: 'i' };
        }

        // Response Time
        query['response.timeMs'] = {
            $gte: minTime ? Number(minTime) : 0,
            $lte: maxTime ? Number(maxTime) : Number.MAX_SAFE_INTEGER
        };

        // Execute
        const skip = (Number(page) - 1) * Number(limit);
        const logs = await Log.find(query)
            .populate('userId', 'prefix firstname lastname isDel')
            .sort(sortBy ? { [sortBy]: order === 'desc' ? -1 : 1 } : { timestamp: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Log.countDocuments(query);
        res.json({ logs, total, pages: Math.ceil(total / Number(limit)) });

    } catch (err) {
        console.error("🔥 Server Error:", err.message);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
};