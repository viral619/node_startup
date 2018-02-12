const User = require("../models").User;

CheckUniqueEmail = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        return res.status(400).json({ message: "Email is Already Exists in Database" });
      }
      next();
    })
    .catch((err) =>{
        return res.status(500).json({ message: "Internal Server Error"});
    });
};

module.exports = CheckUniqueEmail;

