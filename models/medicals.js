var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var medicalsSchema = new Schema({
    medicalid:String,
    details:{
        fname:String,
        mname:String,
        lname:String,
        gender:String,
        dob:Date,
        licenseNumber:{type:String,required:true,unique:true},
        license:String
    },
    credentials: {
        password: {type: String, required: true}
    },
    contacts:{
        mobile:{type:Number,required:true},
        email:{type:String,required:true}
    },
    address:{
        addressLine1:String,
        addressLine2:String,
        city:String,
        state:String,
        pincode:{type:Number}
    },
    medicalContacts:{
        medicalname:String,       
        mmobile:{type:Number,required:true}   
    },
    approve: Boolean,
    date : Date,
    
},{timestamps:true})

module.exports = mongoose.model('medicals',medicalsSchema);