var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var nodemailer = require('nodemailer')
var patientsDb = require('../models/patients')
var labsDb = require('../models/labs')
var path = require('path')
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
var keys = require('../keys/urls')

const auth = (req, res, next) => {
  if (!req.cookies['l_auth']) {
    console.log('.......................');
    
    res.redirect('back')
  } else {
    console.log(req.cookies['l_auth']+',,,')
    next()
  }
}

//logout
const logout = (req,res,next) => {
  console.log(req.cookies['l_auth']+'fdhsfhsdfjkk')  
  res.clearCookie('l_auth');
  res.redirect('/');
}
//logout
router.get('/logout',logout);

/* GET users listing. */
router.get('/registration', function(req, res, next) {
  res.render('labs/registration', {
    title: 'labs | Registration'
  })
});

// lab dashboard and profile
router.get('/labsdashboard',auth,function(req,res,next){
  res.render('labs/labs_dashboard',{
    title:'labs | dashboard',
  })
});

router.post('/labsdashboard',(req,res,next)=>{
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
        res.render('labs/labs_dashboard',{
          title:'labs | dashboard',   
          history1 : data,
        })
      });

      res.cookie('l-d-hi', healthid, {maxAge: 1000*60*10})
    }
    else{
      res.render('labs/labs_dashboard',{
        title:'labs | dashboard',
      })
    }
});

//labs Profile
router.get('/profile',auth,function(req,res,next){
  res.render('labs/profile',{
    title:'labs | profile'
  })
});

router.post('/registerLab', (req, res) => {
  console.log(req.body)

  var {fname, mname, lname, gender, dob,licenseNumber,license,password, mobile,email, addressLine1, addressLine2, city, state, pincode,labname,lmobile} = req.body
  var labid = "L" + licenseNumber

  var data = {
    labid:labid,
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
      password: password
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
  laboratoryContacts:{
      labname:labname,       
      lmobile:lmobile
  },
  approve: false,   
  }

  //Sending UserID And Password in Mail
  var name = fname +" "+ mname+" " + lname
  var useremail = email
  var pass = password
  var msg = name+", you have received this mail because  you are successfully registered to our website. Your User ID : "+labid+". Your password Password : " +pass 

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
  
  labsDb.findOne({
    'details.licenseNumber': licenseNumber
  }, (err, labDb) => {
    if (err) {
      console.log(err)
    }
    if (labDb) {
      // user exists
    } else {
      var newLab = new labsDb(data)
      newLab.save((err, savedData) => {
        if (err) {
          console.log(err)
        }
        res.redirect('/');
      })
    }
  })
});



//file upload


//const mongoURL = keys.mongoURL;
const mongoURL = 'mongodb+srv://sgh1234:sgh1234@cluster0-co3hk.mongodb.net/test1'
// Create mongo connection
const conn = mongoose.createConnection(mongoURL);

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('labs');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'labs'
        };
        resolve(fileInfo);
      });
    });
  }
});
const lab = multer({ storage });

// @route GET /
// @desc Loads form
router.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('labs/labs_dashboard', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('labs/labs_dashboard', { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
router.post('/labsdashboard', lab.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/labs/labsdashboard');
});

// @route GET /files
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

//@route GET /image/:filename
//@desc Display Image
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});



module.exports = router;