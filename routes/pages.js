var express = require('express');
var router = express.Router();
var async = require('async');
var MongoDbHelper = require('../database/MongoDbHelper');
var JetService = require("../services/JetService/JetService");

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
      throw new Error("Error occurred", err);
    }
    else {
      res.render('fileUpload/statusList', {data: data});
    }
  });

});

router.get('/fileUpload/status/:id', function(req, res, next) {
  async.waterfall([
    function(callback) {
      JetService.fileUpload.getFileUploadStatus(req.params.id, callback)
    }
  ], function(err, data) {
    if (err) {
      res.render('fileUpload/error', {message: "Upload ID was not provided, is invalid, or not found."})
    }
    else {
      res.render('fileUpload/status', {data: data})
    }
  });
});

module.exports = router;