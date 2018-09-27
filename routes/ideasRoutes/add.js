const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Idea = mongoose.model('ideas');

router.get('/ideas/add', (req,res) => {
    res.render('ideas/add');
});

router.post('/ideas', (req,res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({ text: 'Please add a title.' })
  }
  if(!req.body.details){
    errors.push({ text: 'Please describe your idea.' })
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Hopefully this idea is a good one!');
        res.redirect('/ideas');
      })
  }
});

module.exports = router;
