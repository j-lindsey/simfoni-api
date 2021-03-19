const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const redirectLogin = require('./redirectLogin');
const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
  SESS_SECRET = 'topsecret',
  SESS_NAME = 'sid',
  SESS_LIFETIME = TWO_HOURS
} = process.env
//==
//app.use(express.static(__dirname + './login'));
//===
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
    maxAge: SESS_LIFETIME,
    sameSite: true,
    secure: false
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use("/venture", require("./venture"));
//app.use('/internal', require('./internal'));
//app.use('/entrepreneur', require('./entrepreneur'));
app.get('/goals', (req, res) => {
  //connect to database
  db.column('objectname', 'tagname', 'objectrank').select()
    .from('object')
    .join('objectprimary', 'object.objectid', '=', 'objectprimary.objectid')
    .join('primarytag', 'objectprimary.primaryid', '=', 'primarytag.primaryid')
    .orderBy('objectrank', 'desc')
    .limit(30)
    .offset(0)
    .then(results => {
      res.json(results);
    });
});

app.put('/goals/addGoal', (req, res) => {
  console.log(req.body);
  let id = Number(req.body.id);
  //insert memberID and goalID 
  for (let i = 0; i < req.body.objects.length; i++) {
    console.log(`${req.body.objects[i]}`);
    db('object').where({ objectname: req.body.objects[i] }).select('objectid').then(results => {
      db('selectedobject').insert({
        objectid: results[0].objectid,
        memberid: id
      }).then(result => console.log(result))
        .catch(err => console.log(err))
    });
  };

  // insert goals into table and retrieve SelectedID
  db('selectedgoal')
    .returning('*')
    .insert({
      goals: req.body.goal.trim()
    }).then(result => {
      db('membergoal').insert({
        selectedid: result[0].selectedid,
        memberid: id
      }).then(result => {
        db.column('goals').select()
          .from('selectedgoal')
          .join('membergoal', 'selectedgoal.selectedid', '=', 'membergoal.selectedid')
          .where({ memberid: id })
          .then(results => {
            console.log(results);
            res.json(results);
          });
      }
      )
    })

});


app.post('/goals/filterbuttons', (req, res) => {
  let number = Number(req.body.length);
  db.column('objectname', 'tagname').select()
    .from('object')
    .join('objectprimary', 'object.objectid', '=', 'objectprimary.objectid')
    .join('primarytag', 'objectprimary.primaryid', '=', 'primarytag.primaryid')
    .where('tagname', req.body.nextValues)
    .andWhere('objectrank', '<', req.body.rank)
    .orderBy('objectrank', 'desc')
    .limit(number)
    .then(results => {
      console.log(results)
      res.json(results);
    }).catch(err => console.log(err))
});

app.delete('/goals/deleteGoal', (req, res) => {
  console.log(req.body);
  let id = Number(req.body.id);
  db.column('selectedgoal.selectedid').select()
    .from('selectedgoal')
    .join('membergoal', 'selectedgoal.selectedid', '=', 'membergoal.selectedid')
    .where({
      memberid: id,
      goals: req.body.goal
    }).then(results => {
      let selected = results[0].selectedid;
      db('membergoal')
        .where('selectedid', selected)
        .andWhere('memberid', id)
        .del()
        .then(results => {
          db('selectedgoal')
            .where('selectedid', selected)
            .del()
        }).then(results => {
          db.column('goals').select()
            .from('selectedgoal')
            .join('membergoal', 'selectedgoal.selectedid', '=', 'membergoal.selectedid')
            .where({
              memberid: id
            }).then(results => {
              console.log(results);
              res.json(results);
            })
        });
    });
});



app.post('/login/vlogin', function (req, res) {
  var response = {//modify the html form and the following
    // username:req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  db.select('*').from('registration')
    .where({
      email: response.email
    })
    .then(result => {
      console.log(result)
      if (result.length > 0) {
        bcrypt.compare(response.password, result[0].password).then(function (result) {
          if (result) {
            db.column('memberid').select()
              .from('registration')
              .where({
                email: response.email
              }).then(result => {
                console.log(result);
                req.session.userID = result[0].memberid;
                console.log(req.session);
                res.redirect('/login/profile/' + req.session.userID);
              })
          }
        });
      }
      else {
        res.status(404).send('Incorrect username and password. Please contact at helpdesk@simfoni.com');
      }
    }
    )
});


app.post('/entrepregistration/newcust', function (req, res) {
  bcrypt.hash(req.body.Password, saltRounds).then(function (hash) {
    req.body.password = hash;
    db('registration')
      .returning('*')
      .insert({
        password: hash,
        fname: req.body.firstName,
        lname: req.body.lastName,
        phonenumber: req.body.phone,
        email: req.body.email,
        mailingaddress: req.body.subAddress,
        city: req.body.subCity,
        state: req.body.subState,
        zipcode: req.body.subZipCode,
        dateofbirth: req.body.birthdate,
        education: req.body.subDescription,
        workhistory: req.body.subWorkhist,
        employmentstatus: req.body.levOfInv,
        managedprofileservices: req.body.ManProfser
      }).then(response => {
        console.log(response[0]);
        req.session.userID = response[0].memberid;
        res.redirect('http://localhost:3000/goals/' + req.session.userID);
      })
      .catch(err => res.status(400).json('unable to register'))
  });
  // this helps to view user input as a response
  //res.send("Your data has been inserted to a database")
});


app.post('/profile/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(error);
    }
  });
  res.clearCookie(SESS_NAME, { path: '/' });
  return res.status(200).redirect('http://localhost:3000/login/form');
})
//sending html on login
app.get('/goals/:id', (req, res) => {
  console.log('goals/id', req.params);
  res.sendFile(path.resolve('../html/entrepreneur.html'));
});


app.get('/profile/:id', (req, res) => {
  console.log(req.params);
  let id = Number(req.params.id);

  db.column('selectedgoal').select()
    .from('goals')
    .join('membergoal', 'selectedgoal.selectedid', '=', 'membergoal.selectedid')
    .where({
      memberid: id
    }).then(results => {
      console.log(results);
      res.json(results);
    })
});


module.exports = app;