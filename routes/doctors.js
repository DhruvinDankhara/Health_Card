var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var patientsDb = require('../models/patients')
var doctorsDb = require('../models/doctors')

const auth = (req, res, next) => {
  if (!req.cookies['d_auth']) {
    // console.log('.......................');
    res.redirect('back')
  } else {
    console.log(req.cookies['d_auth']+',,,')
    next()
  }
}

//logout
const logout = (req,res,next) => {
  console.log(req.cookies['d_auth']+'fdhsfhsdfjkk')  
  res.clearCookie('d_auth');
  res.redirect('/');
}

/* GET users listing. */
router.get('/registration', function(req, res, next) {
  res.render('doctors/registration', {
    title: 'doctors | Registration'
  })
});

//logout
router.get('/logout',logout);

// doctor dashboard and profile
router.get('/doctorsdashboard', auth, function(req,res,next){
  
  if(req.cookies['d-d-hi'] && req.cookies['d_auth']){
    var healthid = req.cookies['d-d-hi'];
    patientsDb.findOne({
      'healthid':healthid
    }, {}, (err, data) => {
      if (err) {
        throw err
      }
      // console.log(historyData.history)
      console.log(data)
      res.render('doctors/doctors_dashboard',{
        title:'doctors | dashboard',   
        history1 : data,
      })
    });
  }

  else{
    res.render('doctors/doctors_dashboard',{
      title:'doctors | dashboard',
    })
  }  
});

//adding 
router.get('/doctorsdashboard/add_', auth, function(req,res,next){
  res.render('doctors/doctors_dashboard/add',{
    title:'doctors | dashboard'
  })
});

//SubmittingHI
router.post('/doctordashboard',function(req,res,next){
    if(req.body.healthid)
    {
      var healthid = req.body.healthid;
      patientsDb.findOne({
        'healthid':healthid
      }, {}, (err, data) => {
        if (err) {
          throw err
        }
        // console.log(historyData.history)
        console.log(data)
        res.render('doctors/doctors_dashboard',{
          title:'doctors | dashboard',   
          history1 : data,
        })
      });

      res.cookie('d-d-hi', healthid, {maxAge: 1000*60*2})
    }
    else{
      res.render('doctors/doctors_dashboard',{
        title:'doctors | dashboard',
      })
    }    
});

//addreport
// router.post('/addreport',(req,res,next)=>{
//   var reportname = req.body.reportname;
//   var healthid = req.cookies['d-d-hi'];
//   console.log(reportname);

//   patientsDb.findOne({
//     'healthid' : healthid
//   },{
//     $push : {
//       history : {
//         report : reportname,
//       }
//     }
//   },
//   (err,data)=>{
//     if (err) {
//       throw err
//     }
//     else{
//       res.redirect('/doctors/doctorsdashboard')
//     }    
//   }) 
// })

router.get('/profile',auth,function(req,res,next){
  res.render('doctors/profile',{
    title:'doctors | profile'
  })
});


//Adding Medicine
router.post('/add',(req,res)=>{
  
  // var healthid = req.cookies['d-d-hi']

  console.log(req.body);
  var{healthid,age,date,q1,q21,disease,medicine1,timedose1,medicine2,timedose2,reportname}=req.body;
  console.log(req.body)
  doctorsDb.findOne({
    'doctorid' : req.cookies['d_auth']
  },
  {_id:0,"details.fname":1,"details.lname":1,"hospitalContacts.hname":1},
  (err,data)=>{
    if(err)
    { // console.log(data)
      console.log(err);
    }
    else
    {
      // console.log(data)
      var doctorname=data.details.fname+" "+data.details.lname
      var hname = data.hospitalContacts.hname

      patientsDb.findOneAndUpdate({
        'healthid' : healthid
      },
      { 
        $push : {
          history : {
            disease : disease,
            medicine : {
              medicine1 : medicine1,
              timedose1 : timedose1,
              q1:q1,
              medicine2 : medicine2,
              timedose2 : timedose2, 
              q2:q2,
              date:date,
            },
            doctorname : doctorname,
            hospitalname : hname,
            report : {
              reportname : reportname
            }
          }
        }
      },
      (err,added)=>{
        if(err)
        {
          console.log(err);
          res.redirect('back')
        }
        else{
          // console.log("Inside the else");          
          res.redirect('/doctors/doctorsdashboard')
        }
      })
    }
  })
  
})

// router.post('/addmedicine',)


router.post('/registerDoctor', (req, res) => {
  console.log(req.body)

  var {fname, mname, lname, gender, dob,licenseNumber,password, mobile,email,degree,speciality, addressLine1, addressLine2, city, state, pincode,hname,hmobile} = req.body
  // var doctorid =  "D" + licenseNumber.slice(-4) + mobile.toString().slice(-4)
  var doctorid = "D" + licenseNumber

  var data = {
    doctorid:doctorid,
    details:{
      fname:fname,
      mname:mname,
      lname:lname,
      gender:gender,
      dob:dob,
      licenseNumber:licenseNumber
      // license:license
  },
  credentials: {
      password: password
  },
  contacts:{
      mobile:mobile,
      email:email
  },
  doctorDetails:{
        degree:degree,
        speciality:speciality,
       },
  address:{
      addressLine1:addressLine1,
      addressLine2:addressLine2,
      city:city,
      state:state,
      pincode:pincode
  },
  hospitalContacts:{
      hname:hname,       
      hmobile:hmobile
  },
  approve: false,      
  }

  //Sending UserID And Password in Mail
  var name = fname +" "+ mname+" " + lname
  var useremail = email
  var pass = password
  var msg = name+", you have received this mail because  you are successfully registered to our website. Your User ID : "+doctorid+". Your password Password : " +pass 

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

  doctorsDb.findOne({
    'details.licenseNumber': licenseNumber
  }, (err, doctorData) => {
    if (err) {
      console.log(err)
    }
    if (doctorData) {
      // res.json(savedData)
    } else {
      var newDoctor = new doctorsDb(data)
      newDoctor.save((err, savedData) => {
        if (err) {
          console.log(err)
        }
        // res.json(savedData)
        res.redirect('/')
      })
    }
  })

})

module.exports = router;