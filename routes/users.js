const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//load user models
require('../models/User');
const User = mongoose.model('users')

//login form
router.get('/users/login', (req,res) => {
  res.render('users/login');
});

router.post('/users/login', (req,res,next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req,res,next);
})

//Register
router.get('/users/register', (req,res) => {
  res.render('users/register');
});

router.post('/users/register', (req,res) => {
  let errors = [];
  if(req.body.password != req.body.passwordC){
    errors.push({text: 'Passwords do not match.'});
  }
  if(req.body.password.length < 4){
    errors.push({text: 'Your password must be at least 4 characters long.'});
  }
  if(errors.length > 0){
    res.render('users/register', {
      errors:errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordC: req.body.passwordC
    });
  } else {
    User.findOne({email: req.body.email})
      .then(user => {
        if(user){
          req.flash('error_msg', 'This email is already in use.');
          res.redirect('/users/register')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              newUser.password = hash;
              newUser.save()
              .then(user => {
                  req.flash('success_msg', 'You have successfully registered and can now log in.');
                  res.redirect('/users/login');
                })
            });
          });
        }
      });
  }
});

module.exports = router;
