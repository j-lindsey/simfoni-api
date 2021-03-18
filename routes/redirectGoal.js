const redirectGoal = (req, res, next) => {
    if (req.session.userID) {
      return res.status(200).redirect(`http://localhost:3000/goals/${req.session.userID}`);
    } else {
      next();
    }
  }

  module.exports = redirectGoal;