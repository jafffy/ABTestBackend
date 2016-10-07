var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var url = 'mongodb://54.186.195.78:27017/trauma';

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    var obj = JSON.parse(req.body);

    console.log(obj);

    var collection = db.collection('documents');

    collection.insertMany([obj], function(err, result) {
      assert.equal(err, null);
      console.log("Inserted.");
      db.close();
    });
  })
});

module.exports = router;
