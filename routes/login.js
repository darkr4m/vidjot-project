const express = require('express');
const router = express.Router();

router.get('/users/login', (req,res) => {
  res.send('login');
});

module.exports = router;
