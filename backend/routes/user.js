const express = require("express")
const router = express.Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hash
    })
    user.save().then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      })
    }
    ).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
  })
})

router.post('/login', (req, res, post) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Invalid Username or Password'
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Username or Password"
        })
      }
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, "secret_this_should_be_longer", { expiresIn: "1h" })
      fetchedUser.token = token;
      fetchedUser.save();
      res.status(200).json({
        token: token,
        expiresIn: 3600
      })
    }).catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'Invalid Username or Password'
      })
    })
})

module.exports = router;
