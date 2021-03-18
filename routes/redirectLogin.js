const redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
      res.redirect('http://localhost:3000/login/form');
    } else {
      next();
    }
  }

  module.exports = redirectLogin;