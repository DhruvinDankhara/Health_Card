var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')
var mongoose = require('mongoose')
var doctorsDb = require('../models/doctors')
var labsDb = require('../models/labs')
var medicalsDb = require('../models/medicals')

// AUTHENTICATION
const auth = (req, res, next) => {
     if (!req.cookies['a_auth']) {
          // console.log('.......................');
          res.redirect('back')
     } else {
          console.log(req.cookies['a_auth']+',,,')
          next()
     }
}
router.get('/admindashboard',auth,function(req,res,next){
    res.render('admin/admindashboard',{
      title:'admin'
     })
});


//LOGOUT
const logout = (req,res,next) => {
  console.log(req.cookies['a_auth']+'fdhsfhsdfjkk')  
  res.clearCookie('a_auth');
  res.redirect('/');
}
router.get('/logout',logout);


router.get('/adoctor',auth,function(req,res,next){
  console.log(req.params.id);
  
  doctorsDb.find({
    'approve' : false
  },
  {createdAt:1,'details.fname':1,'details.lname':1,'hospitalContacts.hname':1,doctorid:1},
  (err,data)=>{
    if(err)
    {
      throw err
    }
    console.log(data)

    res.render('admin/a_doctor',{
      title:'admin | doctor',
      alldata : data,
    })
  })
});



router.get('/amedical',auth,function(req,res,next){

  console.log(req.params.id);
  
  medicalsDb.find({
    'approve' : false
  },
  {createdAt:1,'details.fname':1,'details.lname':1,'medicalContacts.medicalname':1,medicalid:1},
  (err,data)=>{
    if(err)
    {
      throw err
    }
    console.log(data)

    res.render('admin/a_medical',{
      title:'admin | medical',
      alldata : data,
    })
  })
});


router.get('/alab',auth,function(req,res,next){

  console.log(req.params.id);
  
  labsDb.find({
    'approve' : false
  },
  {createdAt:1,'details.fname':1,'details.lname':1,'laboratoryContacts.labname':1,labid:1},
  (err,data)=>{
    if(err)
    {
      throw err
    }
    console.log(data)

    res.render('admin/a_lab',{
      title:'admin | lab',
      alldata : data,
    })
  })
});

router.get('/approve/:id',(req,res,next)=>{
  console.log(req.params.id);
  var id = req.params.id
  if (id[0]=="D")
  {
    doctorsDb.findOneAndUpdate  ({
      'doctorid' : id
    },{approve:true},(err,data)=>{
      if(err)
        throw err
      console.log(data);
      var name = data.details.fname +" " + data.details.lname
      var doctorid = data.doctorid
      var useremail = data.contacts.email
      var pass = data.credentials.password
      var msg = name+", you have received this mail because Admin approve your request base on your uploaded document. Your User ID : "+doctorid+". Your password Password : " +pass 
  
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
        subject: 'Request Approve ',
        text: msg
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.redirect('/admin/adoctor')
    })
  }

  if (id[0]=="M")
  {
    medicalsDb.findOneAndUpdate  ({
      'medicalid' : id
    },{approve:true},(err,data)=>{
      if(err)
        throw err
      console.log(data);
      var name = data.details.fname +" " + data.details.lname
      var medicalid = data.medicalid
      var useremail = data.contacts.email
      var pass = data.credentials.password
      var msg = name+", you have received this mail because Admin approve your request base on your uploaded document. Your User ID : "+medicalid+". Your password Password : " +pass 
  
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
        subject: 'Request Approve ',
        text: msg
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.redirect('/admin/amedical')
    })
  }

  if (id[0]=="L")
  {
    labsDb.findOneAndUpdate  ({
      'labid' : id
    },{approve:true},(err,data)=>{
      if(err)
        throw err
      console.log(data);
      var name = data.details.fname +" " + data.details.lname
      var labid = data.labid
      var useremail = data.contacts.email
      var pass = data.credentials.password
      var msg = name+", you have received this mail because Admin approve your request base on your uploaded document. Your User ID : "+labid+". Your password Password : " +pass 
  
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
        subject: 'Request Approve ',
        text: msg
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.redirect('/admin/alab')
    })
  }


  //Sending UserID And Password in Mail
  
})




module.exports = router;