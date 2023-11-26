const mongoose = require('mongoose');

var PackageSchema = new mongoose.Schema({
    name : { //must be unique and use as keyword 
        type : String,
        minlength : 1,
        trim : true,
        required : true
    },
    package_type : {
        type : Number,// 0- ISP package, 1 -User package
        required : true
    },
    packageCreator:{
        type:String,
        required : true,
        default :'Nttn',
    },

    bandwidth : {
        type : Number,
        required : true
    },
    up_speed : {
        type : Number,
        required : true
    },
    down_speed : {
        type : Number,
        required : true
    },
    duration : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    ongoing : {
        type : Boolean,
        required : true,
        default : true
    },
    isRealIp: {
        type:Boolean,
        required:true,
    },
    downTime:{
        type:Number,
        required:true
    },
    responseTime:{
        type:Number,
        required:true
    },

    offerId:{
        type:String,
        default:null
        
    },
    areas:{
        type:Array,
        required:true
    },
    union:{
        type:String,
        default:null
    },
})

var Package = mongoose.model('Package', PackageSchema);

module.exports = {Package}