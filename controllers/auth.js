const { validationResult, Result } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation Failed");
    error.statusCode = 404;
    error.data = errors.array();
    return error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        name: name,
        password: hashPassword,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "user created successfully", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadeduser;
  User.findOne({ email: email })
    .then((user) => {
      console.log(user,"hshdshdhsdhshdhsd")
      if (user==null) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadeduser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadeduser.email,
          id: loadeduser._id.toString(),
        },
        "somesupersecrectsecret",
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ token: token, userId: loadeduser._id.toString() });
    });
};
