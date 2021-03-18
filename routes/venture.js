const router = require("express").Router();
//const express = require("express");
//const path = require("path");
//const app = express();
const dbConfig = require('./dbConfig');
const sql = require("mssql");


router.get("/", (req, res) => {
  //res.sendFile(dir + '/future-glasses.jpg');
  //db connection
  //"test";
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query("select * from dbo.Career", function (err, recordset) {
      if (err) console.log(err);
      // send records as a response
      console.log(recordset);
      res.json(recordset);
    });
  });
});

/*search route to search for data query*/
router.post('/search', (req, res) => {
  console.log(req.body);
  let values = req.body.search.split(" ");
  console.log(values);
  /*connect to database*/
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    const request = new sql.Request();
    request.query("SELECT GoalName FROM    WHERE  fname = '" +
      req.body.fname +
      "'   WHERE id =  '" +
      req.params.id +
      "' ", function (err, result) {
        if (err) console.log(err);
        // send records as a response
        console.log(result);
        res.json(result);
      });
  });
});



/*router.get("/skill", (req, res) => {
  //res.sendFile(dir + '/future-glasses.jpg');
  //db connection
  //"test";
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query("select * from dbo.Skill", function (err, recordset) {
      if (err) console.log(err);
      // send records as a response
      console.log(recordset);
      res.json(recordset);
    });
  });
});
router.get("/venture", (req, res) => {
  //res.sendFile(dir + '/future-glasses.jpg');
  //db connection
  //"test";
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query("select * from dbo.Venture", function (err, recordset) {
      if (err) console.log(err);
      // send records as a response
      console.log(recordset);
      res.json(recordset);
    });
  });
});*/

module.exports = router;
