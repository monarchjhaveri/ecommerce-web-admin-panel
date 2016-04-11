var JetService = require("../services/JetService/JetService");
var async = require("async");
var CsvFileParserHelper = require("../services/JetService/CsvFileParserHelper");
var zlib = require('zlib');
var MongoDbHelper = require('../database/MongoDbHelper');

var MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB max filesize limit

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var FileUploadResource = {};

FileUploadResource.uploadFile = function(req, res, next) {
    if (!req.file || !req.file.path || !req.body || !req.body.filetype) {
        res.send(400, "Bad Request");
        return;
    }
    async.waterfall([
        // convert the file to a gzipped json string
        function(callback) {
            CsvFileParserHelper.convertFileToObjectGzip(req.file.path, function(err, gzippedFileContents) {
                if (err) {
                    callback(_createCustomErrorMessage("Failed to zip file before upload. Your changes have NOT been saved.", err));
                }
                else {
                    callback(null, gzippedFileContents);
                }
            });
        },
      // get a file upload token
        function(gzippedFileContents, callback) {
            JetService.fileUpload.getFileUploadToken(function(err, uploadToken) {
                if (err) {
                    callback(_createCustomErrorMessage("Could not get upload token. Your changes have NOT been saved.", err));
                }
                else {
                    callback(null, gzippedFileContents, uploadToken);
                }
            });
        },
      // upload the file
        function(gzippedFileContents, uploadToken, callback) {
            var filename = "file.json.gz";
            var url = uploadToken.url;

            JetService.fileUpload.uploadFile(filename, gzippedFileContents, url, function(err, uploadData){
                if (err) {
                    callback(_createCustomErrorMessage("Failure while POSTing file to Jet. Your changes have NOT been saved.", err));
                }
                else {
                    callback(null, uploadData, gzippedFileContents, uploadToken);
                }
            });
        },
        // notify jet of the upload
        function(uploadData, gzippedFileContents, uploadToken, callback) {
            var filetype = req.body.filetype;

            JetService.fileUpload.notifyJet("file.json.gz", filetype, uploadToken, function(err, notificationData){
                if (err) {
                    callback(_createCustomErrorMessage("Failure while notifying JET of the uploaded file. Your changes MAY OR MAY NOT have been saved.", err));
                }
                else {
                    callback(null, notificationData, uploadToken);
                }
            });
        },
        // save data to mongo
        function(notificationData, uploadToken, callback) {
            MongoDbHelper.insertFileUploadObject(notificationData, function(err, data) {
                if (err) {
                    var refId = (uploadToken && uploadToken.jet_file_id) ? uploadToken.jet_file_id : "unknown";
                    callback(_createCustomErrorMessage(
                      "Failure while saving record of file upload to database. Your file reference ID is " + refId + ", please keep a copy of it for your reference. " +
                      "YOUR CHANGES HAVE BEEN SAVED.",
                      err)
                    );
                }
                else {
                    callback(null, notificationData.jet_file_id);
                }
            });
        }
    ],  function(err, data) {
        if (err) {
            console.log(err);

            if (err.customMessage) {
                res.status(500).render('fileUpload/error', {message: err.customMessage})
            }
            else {
                res.status(500).render('fileUpload/error', {
                    message: "Your file may or may not have been uploaded. Please keep an eye out on Jet.com to see if your changes took effect."
                })
            }
        } else {
            res.render('fileUpload/uploadSuccess', {url: '/pages/fileUpload/status/' + data});
        }
    })
};

FileUploadResource.getUploadsList = function(req, res, next) {
    res.send("Nope");
};

FileUploadResource.getUploadDetails = function(req, res, next) {

};

function _responseFunctionFactory(action, res) {
    return function(err, data) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage(action, err));
        } else {
            res.send(data);
        }
    }
}

function _createCustomErrorMessage(message, error) {
    error && console.log(error);
    var e = new Error(message);
    e.customMessage = message;
    return e;
}

module.exports = FileUploadResource;