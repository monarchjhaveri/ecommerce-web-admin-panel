var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");
var ObjectID = require("mongodb").ObjectID;
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var OrdersResource = {};

OrdersResource.list = function(req, res, next) {
    var orderStatus = req.params.order_status;
    async.waterfall([
        function(callback) {
            JetService.getOrdersListByStatus(orderStatus, callback);
        }
    ], _responseFunctionFactory("get list of orders", res));
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



module.exports = OrdersResource;