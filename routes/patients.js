var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var fileUpload = require('express-fileupload');
var patientsDb = require('../models/patients')


const auth = (req, res, next) => {
  if (!req.cookies['p_auth']) {
    console.log('.......................');
    
    res.redirect('back')
  } else {
    console.log(req.cookies['p_auth']+',,,')
    next()
  }
}

//logout
const logout = (req,res,next) => {
  console.log(req.cookies['p_auth']+'fdhsfhsdfjkk')  
  res.clearCookie('p_auth');
  res.redirect('/');
}
//logout
router.get('/logout',logout);

/* GET users listing. */
router.get('/registration', function(req, res, next) {
  res.render('patients/registration', {
    title: 'Patients | Registration'
  })
});

// patient dashboard and profile
router.get('/patientsdashboard',auth,function(req,res,next){

  var patientId = req.cookies['p_auth'] 
  // var patientId = 'P34605764'

  patientsDb.findOne({
    'healthid':patientId
  }, {
    healthid:1,history: 1,contacts:1,
  }, (err, data) => {
    if (err) {
      throw err
    }
    // console.log(historyData.history)
    console.log(data)
    res.render('patients/patients_dashboard',{
      title:'patient | dashboard',   
      history1 : data 
      // history: historyData.history,
      // contacts: historyData.contacts,
    })
  })  
});

//upload File
// router.post('/upload',auth,(req,res,next)=>{
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send('No files were uploaded.');
//   }

//   let sampleFile = req.files.sampleFile;

//   sampleFile.mv('/profilepic/filename.jpg', function(err) {
//     if (err)
//       return res.status(500).send(err);
//     res.send('File uploaded!');
//   });
// });


//patiets Profile
router.get('/profile',auth,function(req,res,next){
  res.render('patients/profile',{
    title:'patient | profile',
    
  })
});

router.post('/registerUser', (req, res) => {
  console.log(req.body)

  var {fname, mname, lname, gender, dob, weight, height, mobile, addressLine1, addressLine2, city, state, pincode, emergencyName, relation, emergencyMobile, bloodGroup, alergies, aadharNumber, password, email} = req.body

  var alergiesArray = alergies.split(',')
  var healthid = "P" + aadharNumber.toString() 

  var data = {
      healthid:healthid,
      details:{
        fname:fname,
        mname:mname,
        lname:lname,
        gender:gender,
        dob:dob,
        aadharNumber:aadharNumber
    },
    credentials: {
        password: password
    },
    contacts:{
        mobile:mobile,
        email:email
    },
    bodyDetails:{
        weight:weight,
        height:height,
        alergies:alergiesArray,
        bloodGroup:bloodGroup
    },
    address:{
        addressLine1:addressLine1,
        addressLine2:addressLine2,
        city:city,
        state:state,
        pincode:pincode
    },
    emergencyContacts:{
        name:emergencyName,       
        mobile:emergencyMobile,
        relation:relation
    }
  }

  //Sending UserID And Password in Mail
  var name = fname +" "+ mname+" " + lname
  var useremail = email
  var pass = password
  var msg = name+", you have received this mail because  you are successfully registered to our website. Your User ID : "+healthid+". Your password Password : " +pass 

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sgh000437@gmail.com',
      pass: 'sgh@1234'
    }
  });

  var mailOptions = {
    from: 'sgh000437@gmail.com',
    to: useremail,
    subject: 'Successfully Register',
    text: msg
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  
  patientsDb.findOne({
    'details.aadharNumber': aadharNumber
  }, (err, patientData) => {
    if (err) {
      console.log(err)
    }
    if (patientData) {
      // user exists
    } else {
      var newPatient = new patientsDb(data)
      newPatient.save((err, savedData) => {
      if (err) {
        console.log(err)
      }   
      // req.flash('Success','Successfully Registered')     
      res.redirect('/');
      })
    }
  })
})


module.exports = router;