const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Idea = mongoose.model('ideas');

router.get('/ideas', (req,res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

module.exports = router;
