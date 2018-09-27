const express = require('express');
const router = express.Router();

router.get('/users/register', (req,res) => {
  res.send('register');
});

module.exports = router;
