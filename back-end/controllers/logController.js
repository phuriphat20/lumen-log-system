const Log = require('../models/Log') ;
const User = require('../models/User') ;

exports.getLogs = async (req , res) => {
    try{
        const {
            action ,
            startDate ,
            endDate ,
            userId ,
            statusCode ,
            labnumber ,
            minTime ,
            maxTime ,
            sortBy ,
            order ,
            page = 1 ,
            limit = 50
        } = req.query ;

        let query = {} ;

        // 1 . Filter by action
        if(action && action !== 'all'){
            query.action = action ;
        }
        // 2 . Filter by date range
        if(startDate && endDate){
            query.timestamp = {
                $gte : new Date(startDate) ,
                $lte : new Date(endDate)
            } ;
        }
        // 3 . Filter by userId
        if(userId && userId !== 'all'){
            query.userId = userId ;
        } 
        // 4 . Filter by status code
        if(statusCode){
            query['response.statusCode'] = Number(statusCode) ;
        }
        // 5 . Filter by lab number
        if(labnumber){
            query.labnumber = {$in : [labnumber]} ;
        }
        // 6 . Filter by response time
        query['response.timeMs'] = {
            $gte : minTime ? Number(minTime) : 0 ,
            $lte : maxTime ? Number(maxTime) : Number.MAX_SAFE_INTEGER
        } ;
        // 7. // Security Check: Filter out logs from soft-deleted users
        const activeUsers = await User.find({isDel : false}).select('_id') ;
        const activeUserIds = activeUsers.map(user => user._id) ;
        if(activeUserIds.length === 0){
            return res.status(404).json({msg : 'No active users found'}) ;
        }
        query.userId = {$in : activeUserIds , ...(query.userId && { $eq : query.userId } )
        } ;
        // Sorting
        let sortOption = {} ;
        if(sortBy){
            sortOption[sortBy] = order === 'desc' ? -1 : 1 ;
        }else{
            sortOption = {timestamp : -1} ;
        }
        // Pagination
        const logs = await Log.find(query)
            .populate('userId' , 'prefix firstname lastname isDel')
            .sort(sortOption)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit)) ;

        const total = await Log.countDocuments(query) ;
        res.json({
            logs ,
            total ,
            pages : Math.ceil(total / limit) ,
        }) ;
    }catch(err){
        res.status(500).json({msg : 'Error fetching logs', error : err.message}) ;
    }
}