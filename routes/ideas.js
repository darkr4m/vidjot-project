const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Idea = mongoose.model('ideas');

//IDEA INDEX
router.get('/ideas', (req,res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//ADD IDEAS ROUTE
router.get('/ideas/add', (req,res) => {
    res.render('ideas/add');
});

//ADD IDEAS POST AND VALIDATION
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

//EDIT UPDATE
router.get('/ideas/edit/:id', (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  })
});

router.put('/ideas/:id', (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
    .then(idea => {
      req.flash('success_msg', 'Idea updated.');
      res.redirect('/ideas');
    })
  })
});

//DELETE
router.delete('/ideas/:id', (req,res) => {
  Idea.deleteOne({ _id: req.params.id})
  .then(() => {
    req.flash('success_msg', 'Bad idea removed...');
    res.redirect('/ideas');
  })
});

module.exports = router;
