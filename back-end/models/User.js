const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String ,
        required : true ,
        unique : true
    } , 
    password : {
        type : String ,
        required : true
    } ,
    code : String ,
    prefix : String ,
    firstname : String ,
    lastname : String ,
    level : {
        type : String ,
        enum : ['admin' , 'user'] ,
        default : 'user'
    },
    isActive : {
        type : Boolean ,
        default : true
    },
    isDel : {
        type : Boolean ,
        default : false
    }
}) ;

module.exports = mongoose.model('User' , userSchema) ;