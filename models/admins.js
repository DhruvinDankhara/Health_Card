var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var adminSchema = new Schema({
    adminid:String,
    details:{
        fname:String,
        mname:String,
        lname:String,
        gender:String,
        dob:Date,
        aadharNumber:{type:Number,required:true,unique:true}
    },
    credentials: {
        password: {type: String, required: true}
    },
    contacts:{
        mobile:{type:Number,required:true},
        email:{type:String,required:true}
    },
        // date : Date,
},{timestamps:true})

module.exports = mongoose.model('admins',adminSchema);



