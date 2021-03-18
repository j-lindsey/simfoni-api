const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
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

app.use("/venture", require("./venture"));
app.use('/internal', require('./internal'));
app.use('/entrepreneur', require('./entrepreneur'));
app.use('/goals', require('./goals'));
app.use('/login', require('./login'));
app.use('/entrepregistration', require('./entrepregistration'));


app.post('/profile/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(error);
    }
  });
  res.clearCookie(SESS_NAME, {path:'/'});
  return res.status(200).redirect('http://localhost:3000/login/form');
})
//sending html on login
app.get('/goals/:id', (req, res) => {
  console.log('goals/id', req.params);
  res.sendFile(path.resolve('../html/entrepreneur.html'));
});
module.exports = app;