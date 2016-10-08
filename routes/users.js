var express = require('express');
var router = express.Router();
var url = require('url');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(req.query.userID + 'sdflkjasdf');
});

module.exports = router;
