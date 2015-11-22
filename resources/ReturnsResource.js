var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var ReturnsResource = {};

ReturnsResource.getDetails = function(req, res, next) {
    var return_id = req.params.return_id;
    async.waterfall([
        function(callback) {
            JetService.getReturnDetails(return_id, callback);
        }
    ], _responseFunctionFactory("get details of return", res));
};

ReturnsResource.list = function(req, res, next) {
    var returnStatus = req.params.return_status;
    async.waterfall([
        function(callback) {
            JetService.getReturnsListByStatus(returnStatus, callback);
        }
    ], _responseFunctionFactory("get list of returns", res));
};

ReturnsResource.complete = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if (!req.params || !req.params.return_id) {
                callback(new Error("Must provide a return_id"));
            }
            if (!req.body) {
                callback(new Error("Must provide Completed Return DTO."));
            }

            var payload = req.body;
            var return_id = req.params.return_id;
            callback(null, payload, return_id);
        },
        JetService.completeReturn
    ], _responseFunctionFactory("complete return", res));
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



module.exports = ReturnsResource;