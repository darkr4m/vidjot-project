const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Idea = mongoose.model('ideas');

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

router.delete('/ideas/:id', (req,res) => {
  Idea.remove({ _id: req.params.id})
  .then(() => {
    req.flash('success_msg', 'Bad idea removed...');
    res.redirect('/ideas');
  })
});

module.exports = router;
