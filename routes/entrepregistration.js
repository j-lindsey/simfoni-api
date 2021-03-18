var bodyParser = require('body-parser');
const path = require('path');
const router = require('express').Router();
var express = require('express');
var _ = require('underscore');
var db = require('./db');
const redirectGoal = require('./redirectGoal');
//var session = require('express-session');
const { result } = require('underscore');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//const app = express();
var executeQuery = async function (query) {
  try {
    var connectionPool = await db;
    var result = await connectionPool.request().query(query);
    return result.recordset;
  }
  catch (err) {
    console.log({
      success: false,
      error: err
    });
  }
}
//send json formatted record set as a response
var sendQueryResults = async function (res, query) {
  try {
    var recordset = await executeQuery(query);
    res.json(recordset);
  }
  catch (err) {
    //return res.send({
    res.send({
      success: false,
      error: err
    });
    //return;
  }
  //return;
};
//create a routes to access the page from front end 
module.exports = router;
//var app = express();
router.use(bodyParser.json());//used to get the req.body contenet as json
//router.get('/', (req, res) => {
router.get('/', function (req, res) {
  res.send('Hello World!');
});
//-----------------------For testing you can use POSTMAN-------------------------------
//app.use('/entrepregistration', require('./entrepregistration'));
router.get('/form', redirectGoal, function (req, res) {
  res.sendFile(path.resolve('../html/entrepregistration.html'));
  //res.sendFile('../../html/login.html', { root: __dirname });
  //res.sendFile( __dirname + "/" + "index.html" );    //load the index.html form 
});
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
//   ==================       ++++++++++++++++++              ==================
// -----------------------For testing you can use POSTMAN-------------------------------
// router.get('/form', function (req, res) {
//   res.sendFile( __dirname + "/" + "entrepregistration.html" );    //load the index.html form 
//   });
var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.post('/newcust', redirectGoal, function (req, res) {
  var response = {//modify the html form and the following
    //id:req.body.id,  
    Password: req.body.Password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    subAddress: req.body.subAddress,
    subCity: req.body.subCity,
    subState: req.body.subState,
    subZipCode: req.body.subZipCode,
    birthdate: req.body.birthdate,
    subDescription: req.body.subDescription,
    subWorkhist: req.body.subWorkhist,
    levOfInv: req.body.levOfInv,
    ManProfser: req.body.ManProfser,
  };
  bcrypt.hash(req.body.Password, saltRounds).then(function (hash) {
    response.Password = hash;
    var sql = "INSERT INTO  Registration(Password,FName,LName,PhoneNumber,Email, MailingAddress,City,State,ZipCode,DateOfBirth,Education,WorkHistory,EmploymentStatus, ManagedProfileServices) VALUES('" + response.Password + "','" + response.firstName + "','" + response.lastName + "','" + response.phone + "','" + response.email + "','" + response.subAddress + "','" + response.subCity + "','" + response.subState + "','" + response.subZipCode + "','" + response.birthdate + "','" + response.subDescription + "',' " + response.subWorkhist + "','" + response.levOfInv + "','" + response.ManProfser + "')";
    executeQuery(sql).then(
      executeQuery(`SELECT MemberID FROM Registration WHERE Email = '${response.email}'`)
        .then(results => {
          req.session.userID = results[0].MemberID;
          res.redirect('http://localhost:3000/goals/' + req.session.userID);
        }))
  });
  // this helps to view user input as a response
  //res.send("Your data has been inserted to a database")
});
// 
//==================      ++++++++++++++++++++       ================= Registration
//=======================verify password == accounts===============
router.get('/form2', redirectGoal, function (req, res)
//router.get('/form',function (req, res)
{
  res.sendFile(__dirname + "/" + "login.html");    //load the login.html form 
});
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//==
router.post('/vlogin', redirectGoal, function (req, res) {
  //console.log (req.body.username);
  var response = {//modify the html form and the following
    // username:req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  var sql = "SELECT * FROM Registration WHERE Email= '" + response.email + "' and Password = '" + response.password + "'";
  //var sql = "SELECT * FROM accounts WHERE email= '"+response.email+"' and password = '"+response.password+"'";
  //var sql = "SELECT * FROM accounts WHERE username = '"+response.username+"' and password = '"+response.password+"'";

  executeQuery(sql).then(result => {

    if (result.length > 0) {
      console.log(result);
      res.status(404).send('correct password');
    }
    else {
      res.status(404).send('Incorrect username and password. Please contact at helpdesk@simfoni.com');
    }
  }
  )
})


