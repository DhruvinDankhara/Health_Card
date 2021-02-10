var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var doctorsSchema = new Schema({
    doctorid:String,
    details:{
        fname:String,
        mname:String,
        lname:String,
        gender:String,
        dob:Date,
        licenseNumber:{type:String,unique:true,required:true},
        license:String
    },
    credentials: {
        password: {type: String, required: true}
    },
    contacts:{
        mobile:{type:Number,required:true},
        email:{type:String,required:true}
    },
    doctorDetails:{
          degree:String,
          speciality:Array,
         },
    address:{
        addressLine1:String,
        addressLine2:String,
        city:String,
        state:String,
        pincode:{type:Number}
    },
    hospitalContacts:{
        hname:String,       
        hmobile:{type:Number,required:true}
    },
    approve: Boolean,
    date : Date,
     
    
},{timestamps:true})

module.exports = mongoose.model('doctors',doctorsSchema);



