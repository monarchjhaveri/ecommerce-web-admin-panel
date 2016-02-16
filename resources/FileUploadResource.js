var JetService = require("../services/JetService/JetService");
var async = require("async");
var CsvFileParserHelper = require("../services/JetService/CsvFileParserHelper");

var MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB max filesize limit

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var FileUploadResource = {};

FileUploadResource.uploadFile = function(req, res, next) {
    CsvFileParserHelper.convertFileToObject(req.file.path, _responseFunctionFactory("uploadFile", res));
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