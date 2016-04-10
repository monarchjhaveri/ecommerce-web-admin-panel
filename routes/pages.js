var express = require('express');
var router = express.Router();
var async = require('async');
var MongoDbHelper = require('../database/MongoDbHelper');

/* GET products listing. */
router.get('/fileUpload', function(req, res, next) {
  res.render('fileUpload/fileUpload');
});

router.get('/fileUpload/status', function(req, res, next) {
  async.waterfall([
    function(callback) {
      MongoDbHelper.getFileUploadList(callback);
    }
  ], function(err, data) {
    if (err) {
      throw new Error("Error occured", err);
    }
    else {
      res.render('fileUpload/statusList', {data: data});
    }
  });

});

router.get('/fileUpload/status/:id', function(req, res, next) {
  res.render('fileUpload/status', {id: req.params.id});
});

module.exports = router;