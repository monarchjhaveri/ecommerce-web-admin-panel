var JetService = require("../services/JetService/JetService");
var async = require("async");
var CsvFileParserHelper = require("../services/JetService/CsvFileParserHelper");
var zlib = require('zlib');

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
            CsvFileParserHelper.convertFileToObjectGzip(req.file.path, callback);
        },
        function(gzippedJsonString, callback) {
            JetService.uploadFile('file.json.gz', req.body.filetype, gzippedJsonString, callback);
        }
    ], _responseFunctionFactory("uploadFile", res))
};

FileUploadResource.getUploadsList = function(req, res, next) {
    res.send("Nope");
};

FileUploadResource.getUploadDetails = function(req, res, next) {
    res.send("Nope");
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



module.exports = FileUploadResource;