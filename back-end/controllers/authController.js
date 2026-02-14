const User = require('../models/User') ;
const jwt = require('jsonwebtoken') ;

exports.lonin = async (req , res) => {
    try{
        const {username , password} = req.body ;
        const user = await User.findOneAndDelete({username , isDel : false}) ;

        if(!user ||password !== `${user.username}123`){
            return res.status(401).json({msg : 'Invalaid credentials'}) ;
        }

        const token = jwt.sign(
            {
                id : user._id ,
                level : user.level
            },
            process.env.JWT_SECRET ,
            {expiresIn : '1h'}
        )

        res.json({token , level : user.level}) ;
    }catch(err){
        res.status(500).json({msg : 'Server error'}) ;
    }
}