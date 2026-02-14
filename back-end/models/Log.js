const e = require('express');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    timestamp : {
        type : Date ,
        required : true ,
    } ,
    request : {
        method : String ,
        endpoint : String ,
    } ,
    response : {
        statusCode : String ,
        message : String ,
        timeMs : Number
    } ,
    action : {
        type : String ,
        required : true ,
    } ,
    userId :{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    } ,
    labnumber : {
        type : [String] ,
        default : []
    }
}) ;

module.exports = mongoose.model('Log' , userSchema) ;