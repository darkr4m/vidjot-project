const express = require('express');
const router = express.Router();

router.get('/users/login', (req,res) => {
  res.render('users/login');
});

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
    res.send('passed');
  }
});

module.exports = router;
