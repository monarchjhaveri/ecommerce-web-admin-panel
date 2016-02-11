var JetService = require("../services/JetService/JetService");
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var FileUploadResource = {};

function convertCsv(csvFile) {

}

//FileUploadResource.getNodeAttributes = function(req, res, next) {
//    var node_id = req.params.node_id;
//    async.waterfall([
//        function(callback) {
//            JetService.getNodeAttributes(node_id, callback);
//        }
//    ], _responseFunctionFactory("get node attributes", res));
//};

FileUploadResource.uploadFile = function(req, res, next) {
    var csvFileData = req.file;
    var fileType = req.body.filetype;
    var fileSize = csvFileData.size;



    
    res.send("Uploaded successfully! <a href='/file_upload.html'>Go Back</a>");
};

FileUploadResource.getUploadsList = function(req, res, next) {

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



module.exports = FileUploadResource;