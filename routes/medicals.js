var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var medicalsDb = require('../models/medicals')
var patientsDb = require('../models/patients')


const auth = (req, res, next) => {
  if (!req.cookies['m_auth']) {
    console.log('.......................');
    
    res.redirect('back')
  } else {
    console.log(req.cookies['m_auth']+',,,')
    next()
  }
}

//logout
const logout = (req,res,next) => {
  console.log(req.cookies['m_auth']+'fdhsfhsdfjkk')  
  res.clearCookie('m_auth');
  res.redirect('/');
}
//logout
router.get('/logout',logout);


/* GET users listing. */
router.get('/registration', function(req, res, next) {
  res.render('medicals/registration', {
    title: 'medicals | Registration'
  })
});

// medical dashboard and profile
router.get('/medicalsdashboard',auth,function(req,res,next){
  res.render('medicals/medicals_dashboard',{
    title:'medicals | dashboard',
  })
});

router.post('/medicalsdashboard',auth,function(req,res,next){
  if(req.body.healthid)
  {
    // console.log(req.body.healthid);
    var healthid = req.body.healthid;

    patientsDb.findOne({
      'healthid' : healthid
    },{},(err,data) =>{
      if(err)
        throw err
      console.log(data);
      res.render('medicals/medicals_dashboard',{
        title : 'Medical | dashbord',
        history1 : data,
      })
    })
    res.cookie('m-d-hi', healthid, {maxAge: 1000*60*10})
  }
  else{
    res.render('medicals/medicals_dashboard',{
      title : 'Medical | dashbord',
    })
  }
});

//medicals Profile
router.get('/profile',auth,function(req,res,next){
  res.render('medicals/profile',{
    title:'medicals | profile'
  })
});

router.post('/registerMedical', (req, res) => {
  console.log(req.body)

  var {fname, mname, lname, gender, dob,licenseNumber,license,password, mobile,email, addressLine1, addressLine2, city, state, pincode,medicalname,mmobile} = req.body
  var medicalid = "M" + licenseNumber

  var data = {
    medicalid:medicalid,
    details:{
      fname:fname,
      mname:mname,
      lname:lname,
      gender:gender,
      dob:dob,
      licenseNumber:licenseNumber,
      license:license
  },
  credentials: {
      password:password
  },
  contacts:{
      mobile:mobile,
      email:email
  },
  address:{
      addressLine1:addressLine1,
      addressLine2:addressLine2,
      city:city,
      state:state,
      pincode:pincode
  },
  medicalContacts:{
      medicalname:medicalname,       
      mmobile:mmobile      
    },
    approve: false,   
  }


  //Sending UserID And Password in Mail
  var name = fname +" "+ mname+" " + lname
  var useremail = email
  var pass = password
  var msg = name+", you have received this mail because  you are successfully registered to our website. Your User ID : "+medicalid+". Your password Password : " +pass 

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
  
  medicalsDb.findOne({
    'details.licenseNumber': licenseNumber
  }, (err, medicalData) => {
    if (err) {
      console.log(err)
    }
    if (medicalData) {
      // user exists
    } else {
      var newMedical = new medicalsDb(data)
      newMedical.save((err, savedData) => {
        if (err) {
          console.log(err)
        }
        res.redirect('/');
      })
    }
  })


});

module.exports = router;