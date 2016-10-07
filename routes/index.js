var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var url = 'mongodb://54.186.195.78:27017/myproject';

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    db.close();
  })
});

module.exports = router;
