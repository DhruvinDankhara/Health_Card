var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var flash = require('connect-flash')
var patientsDb = require('../models/patients')
var adminsDb = require('../models/admins')
var doctorsDb = require('../models/doctors')
var labsDb = require('../models/labs')
var medicalsDb = require('../models/medicals')

/* GET home page. */
router.get('/registration', function(req, res, next) {
  res.render('general/registration', {
    title: 'Registration'
  })
});

//login page
// router.get('/', function(req, res, next) {
//   res.render('general/login', {
//     title: 'Login'
//   })
// });

router.get('/', (req, res) => {
  // req.flash('message', 'This is a message from the "/" endpoint');
  res.render('general/login',{
    title : 'Login',
  });
});


// forget password mail
router.post('/',(req,res)=>{
    var {forget_password} = req.body
  console.log(forget_password)
  check = forget_password[0]
  

  //Send Mail to Patient
  if(check == "P")
  {
    patientsDb.findOne({
      'healthid': forget_password
    },{"contacts.email":1,"credentials.password":1,"details.fname":1,"details.mname":1,"details.lname":1,_id:0},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        // console.log(data.contacts.email)
        // console.log(data.credentials.password)
  
        var name = data.details.fname +" "+ data.details.mname+" " + data.details.lname
        var email = data.contacts.email
        var pass = data.credentials.password
        var msg = name+", you have received this mail because  you are successfully registered to our website. Your password for HealthId : "+ forget_password +" "+"Password : " +pass 
  
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'sgh000437@gmail.com',
            pass: 'sgh@1234'
          }
        });
  
        var mailOptions = {
          from: 'sgh000437@gmail.com',
          to: email,
          subject: 'HealthCard Forget Password',
          text: msg
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
  }

  //Send Mail to Medical
  else if(check == "M")
  {
    medicalsDb.findOne({
      'medicalid': forget_password
    },{"contacts.email":1,"credentials.password":1,"details.fname":1,"details.mname":1,"details.lname":1,_id:0},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        // console.log(data.contacts.email)
        // console.log(data.credentials.password)
  
        var name = data.details.fname +" "+ data.details.mname+" " + data.details.lname
        var email = data.contacts.email
        var pass = data.credentials.password
        var msg = name+", you have received this mail because  you are successfully registered to our website. Your password for HealthId : "+ forget_password +" "+"Password : " +pass 
  
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'sgh000437@gmail.com',
            pass: 'sgh@1234'
          }
        });
  
        var mailOptions = {
          from: 'sgh000437@gmail.com',
          to: email,
          subject: 'HealthCard Forget Password',
          text: msg
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
  }

  //Send Mail to Doctor
  else if(check == "D")
  {
    doctorsDb.findOne({
      'doctorid': forget_password
    },{"contacts.email":1,"credentials.password":1,"details.fname":1,"details.mname":1,"details.lname":1,_id:0},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        // console.log(data.contacts.email)
        // console.log(data.credentials.password)
  
        var name = data.details.fname +" "+ data.details.mname+" " + data.details.lname
        var email = data.contacts.email
        var pass = data.credentials.password
        var msg = name+", you have received this mail because  you are successfully registered to our website. Your password for HealthId : "+ forget_password +" "+"Password : " +pass 
  
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'sgh000437@gmail.com',
            pass: 'sgh@1234'
          }
        });
  
        var mailOptions = {
          from: 'sgh000437@gmail.com',
          to: email,
          subject: 'HealthCard Forget Password',
          text: msg
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
  }


  //Send mail to Lab
  else if(check == "L")
  {
    labsDb.findOne({
      'labid': forget_password
    },{"contacts.email":1,"credentials.password":1,"details.fname":1,"details.mname":1,"details.lname":1,_id:0},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        // console.log(data.contacts.email)
        // console.log(data.credentials.password)
  
        var name = data.details.fname +" "+ data.details.mname+" " + data.details.lname
        var email = data.contacts.email
        var pass = data.credentials.password
        var msg = name+", you have received this mail because  you are successfully registered to our website. Your password for HealthId : "+ forget_password +" "+"Password : " +pass 
  
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'sgh000437@gmail.com',
            pass: 'sgh@1234'
          }
        });
  
        var mailOptions = {
          from: 'sgh000437@gmail.com',
          to: email,
          subject: 'HealthCard Forget Password',
          text: msg
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
  }  
})


router.post('/Dashboard',(req,res)=>{
  var {userid,password} = req.body
  console.log(userid,password)
  check = userid[0]

  // let errors = [];
  // if(!userid){
  //   errors.push({ msg: 'Please Enter UserID' });
  // }

  // if(!password){
  //   errors.push({ msg: 'Please Enter Password' });
  // }
  // if (errors.length > 0) {
  //   console.log(errors.toString());
  //   errors = errors.toString()   
  //   res.render('general/login', {errors})
  // }
  // //patient
  // else

  if(check == "P")
  {
    // console.log("Inside the Patient")
    patientsDb.findOne({'healthid': userid},  
    {"credentials.password":1,_id:0,approve:1},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        // console.log("inside the Else");        
        if(data.credentials.password===password)
        {
          if(data.approve === false)
          {
            res.send("please wait for Admin Approval")
          }
          else{
            res.clearCookie('d_auth')
            res.clearCookie('m_auth')
            res.clearCookie('l_auth')
            res.cookie('p_auth', userid, {maxAge: 60*1000*60*2})
            res.redirect('/patients/patientsdashboard')
          }            
        }
        else
        {
            // req.flash('errMsg', 'Something Went Wrong');
            res.redirect('back')
            // errMsg : req.flash('errMsg'),
            // sucMsg : req.flash('sucMsg')
            console.log("NOt matched....")
        }
      }
    })
  }
  //doctor
  if(check == "D")
  {
    // console.log(check_id)
    doctorsDb.findOne({
      'doctorid': userid
    },{"credentials.password":1,_id:0,'approve':1},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        if(data.credentials.password===password)
        {
          if(data.approve === false)
          {
            res.send("Wait for admin approval.......");
          }
          else{
            res.clearCookie('p_auth')
            res.clearCookie('m_auth')
            res.clearCookie('l_auth')
            res.cookie('d_auth', userid, {maxAge : 1000*60*60*2}) // 2 hours
            res.redirect('/doctors/doctorsdashboard')
          }
        }
        else{
            console.log("NOt matched....")
        }
      }
    })
  }
  //medical
  if(check == "M")
  {
    // console.log(check_id)
    medicalsDb.findOne({
      'medicalid': userid
    },{"credentials.password":1,_id:0,'approve':1},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        if(data.credentials.password===password)
        {
          if (data.approve === false) {
            res.send("Wait for admin approval.......");
          }
          else
          {
            res.clearCookie('d_auth')
            res.clearCookie('p_auth')
            res.clearCookie('l_auth')
            res.cookie('m_auth', userid, {maxAge: 60*1000*60*2})
            res.redirect('/medicals/medicalsdashboard')
          }          
        }
        else{
            console.log("NOt matched....")
        }
      }
    })
  }
  //lab
  if(check == "L")
  {
    // console.log(check_id)
    labsDb.findOne({
      'labid': userid
    },{"credentials.password":1,_id:0,'approve':1},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        if(data.credentials.password===password)
        {
          if (data.approve === false) {
            res.send("Wait for admin approval.......");
          }
          else{
            res.clearCookie('d_auth')
            res.clearCookie('m_auth')
            res.clearCookie('p_auth')
            res.cookie('l_auth', userid, {maxAge: 60*1000*60*2})
            res.redirect('/labs/labsdashboard')
          }
        }
        else{
            console.log("NOt matched....")
        }
      }
    })
  } 

  if(check == "A")
  {
    // console.log(check_id)
    adminsDb.findOne({
      'adminid': userid
    },{"credentials.password":1,_id:0},
    (err,data)=>{
      if(err){
        console.log(err)
      }
      else{
        console.log(data);
        
        if(data.credentials.password===password)
        {      
            res.clearCookie('d_auth')
            res.clearCookie('m_auth')
            res.clearCookie('p_auth')
            res.clearCookie('l_auth')
            res.cookie('a_auth', userid, {maxAge: 60*1000*60*2})
            res.redirect('/admin/admindashboard')
        }
        else{
            console.log("NOt matched....")
        }
      }
    })
  }

})


/*
var id = req.cookies['d_auth']

*/

module.exports = router;
