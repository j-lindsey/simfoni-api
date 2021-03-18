const router = require("express").Router();
const dbConfig = require('./dbConfig');
const db = require('./db');
const sql = require("mssql");
const redirectLogin = require('./redirectLogin');

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



router.get("/", (req, res) => {
  //connect to database
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query(`SELECT TOP 30 ObjectName, TagName, ObjectRank FrOM Object
      JOIN ObjectPrimary ON Object.ObjectID = ObjectPrimary.ObjectID
      JOIN PrimaryTag ON ObjectPrimary.PrimaryID = PrimaryTag.PrimaryID
      ORDER BY ObjectRank DESC`, function (err, results) {
      if (err) console.log(err);
      // send records as a response
      res.json(results);
    });
  });
});

router.put('/addGoal', (req, res) => {
  console.log(req.body);
  let id = Number(req.body.id);
  //insert memberID and goalID 
  for (let i = 0; i < req.body.objects.length; i++) {
    console.log(`${req.body.objects[i]}`);
    executeQuery(`SELECT ObjectID from Object WHERE ObjectName = '${req.body.objects[i]}'`).then(results => {
      console.log(results);
      executeQuery(`INSERT INTO SelectedObject (ObjectID, MemberID) VALUES (${results[0].ObjectID}, ${id})`).then(result => console.log(result))
    });
  };

  // insert goals into table and retrieve SelectedID
  executeQuery(`INSERT INTO SelectedGoal (Goals) VALUES ('${req.body.goal.trim()}'); SELECT * FROM SelectedGoal WHERE SelectedID = SCOPE_IDENTITY()`).then(result => {
    //insert into MemberGoal table
    executeQuery(`INSERT INTO MemberGoal (SelectedID, MemberID) VALUES (${result[0].SelectedID}, ${id}); SELECT Goals FROM SelectedGoal JOIN MemberGoal ON SelectedGoal.SelectedID = MemberGoal.SelectedID WHERE MemberID = ${id} `)
      .then(results => {
        console.log(results);
        res.json(results);
      });
  });
});



router.post('/filterbuttons', (req, res) => {
  console.log(req.body);

  let number = Number(req.body.length);
  sql.connect(dbConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query(`SELECT TOP ${number} ObjectName, TagName FROM Object
        JOIN ObjectPrimary ON Object.ObjectID = ObjectPrimary.ObjectID
        JOIN PrimaryTag ON ObjectPrimary.PrimaryID = PrimaryTag.PrimaryID
        WHERE TagName = '${req.body.nextValues}' AND ObjectRank < ${req.body.rank}
        ORDER BY ObjectRank DESC`, function (err, results) {
      if (err) console.log(err);
      // send records as a response
      console.log(results);
      res.json(results);
    });
  });
});

router.delete('/deleteGoal', (req, res) => {
  console.log(req.body);
  let id = Number(req.body.id);
  executeQuery(`SELECT SelectedGoal.SelectedID FROM SelectedGoal JOIN MemberGoal ON SelectedGoal.SelectedID = MemberGoal.SelectedID
  WHERE MemberID = ${id} AND Goals = '${req.body.goal}'`)
    .then(results => {
      console.log(results);
      executeQuery(`DELETE FROM MemberGoal WHERE SelectedID = ${results[0].SelectedID} AND MemberID = ${id}; DELETE FROM SelectedGoal WHERE SelectedID = ${results[0].SelectedID}; SELECT Goals FROM SelectedGoal JOIN MemberGoal ON SelectedGoal.SelectedID = MemberGoal.SelectedID WHERE MemberID = ${id} `)
        .then(results => {
          console.log(results);
          res.json(results);
        })
    });
});


router.get('/profile/:id', (req, res) => {
  console.log(req.params);
  let id = Number(req.params.id);
  executeQuery(`SELECT Goals FROM SelectedGoal JOIN MemberGoal ON SelectedGoal.SelectedID = MemberGoal.SelectedID WHERE MemberID = ${id} `)
    .then(results => {
      console.log(results);
      res.json(results);
    });
});

module.exports = router;

