var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

var url = 'mongodb://54.186.195.78:27017/trauma';

/* GET home page. */
router.get('/', function(req, res, next) {
  var content = '';

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    var collection = db.collection('documents');

    content = collection.find({}).toArray(function(err, docs){
      assert.equal(null, err);
      content = JSON.stringify(docs);

			console.log('Sended.');
			db.close();

			res.render('index', { title: 'Express', content: content });
    });
  });
});

router.post('/', function(req, res, next) {
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
