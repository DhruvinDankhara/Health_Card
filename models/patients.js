var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var patientsSchema = new Schema({
    healthid:String,
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
    bodyDetails:{
        weight:Number,
        height:Number,
        alergies:Array,
        bloodGroup:String
    },
    address:{
        addressLine1:String,
        addressLine2:String,
        city:String,
        state:String,
        pincode:{type:Number}
    },
    emergencyContacts:{
        name:String,       
        mobile:{type:Number,required:true},
        relation:String
    },
    history : {
        type : Array,
        disease : String,
        medicine : {
            type : Array,
            medicine1 : String,
            timedose1 : String,
            q1 : Number,   
            medicine2 : String,
            timedose2 : String,                       
            q2 : Number,
            date:Date,
        },
        doctorname : String,
        hospitalname : String,
        lab : {
            reportname : String,
        },
    }
},{timestamps:true})

module.exports = mongoose.model('patients',patientsSchema);



