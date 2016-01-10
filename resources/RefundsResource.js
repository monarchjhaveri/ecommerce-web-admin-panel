var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var RefundsResource = {};

RefundsResource.getDetails = function(req, res, next) {
    var refund_url_id = req.params.refund_url_id;
    async.waterfall([
        function(callback) {
            JetService.getRefundDetails(refund_url_id, callback);
        },
        function(refundDetailsDto, callback) {
            refundDetailsDto.refund_url_id = refund_url_id;
            callback(null, refundDetailsDto);
        }
    ], _responseFunctionFactory("get details of refund", res));
};

RefundsResource.list = function(req, res, next) {
    var refundStatus = req.params.refund_status;
    async.waterfall([
        function(callback) {
            JetService.getRefundsListByStatus(refundStatus, callback);
        }
    ], _responseFunctionFactory("get list of refunds", res));
};

RefundsResource.post = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if (!req.params || !req.params.order_id) {
                callback(new Error("Must provide an order_id"));
            }
            if (!req.body) {
                callback(new Error("Must provide Refund DTO."));
            }

            var payload = req.body;
            var order_id = req.params.order_id;
            callback(null, payload, refund_url_id);
        },
        JetService.completeRefund
    ], _responseFunctionFactory("complete refund", res));
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



module.exports = RefundsResource;