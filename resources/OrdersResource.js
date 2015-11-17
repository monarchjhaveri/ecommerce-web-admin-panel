var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");
var ObjectID = require("mongodb").ObjectID;
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var OrdersResource = {};

OrdersResource.getDetails = function(req, res, next) {
    var merchant_order_id = req.params.merchant_order_id;
    async.waterfall([
        function(callback) {
            JetService.getOrderDetails(merchant_order_id, callback);
        }
        //function(originalData, originalCallback) {
        //    var relevant_products = {};
        //    async.forEach(
        //        originalData.order_items,
        //        function(orderItem, iteratorCallback) {
        //            MongoDbHelper.find({merchant_sku: orderItem.merchant_sku}, function(error, data) {
        //                if (data) {
        //                    relevant_products[orderItem.merchant_sku] = data[0];
        //                }
        //                iteratorCallback(null, data);
        //            })
        //        },
        //        function(err) {
        //            originalData.relevant_products = relevant_products;
        //            originalCallback(err, originalData)
        //        }
        //    );
        //}
    ], _responseFunctionFactory("get list of orders", res));
};

OrdersResource.list = function(req, res, next) {
    var orderStatus = req.params.order_status;
    async.waterfall([
        function(callback) {
            JetService.getOrdersListByStatus(orderStatus, callback);
        }
    ], _responseFunctionFactory("get list of orders", res));
};

OrdersResource.acknowledge = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if (!req.params || !req.params.merchant_order_id) {
                callback(new Error("Must provide a merchant_order_id"));
            }
            if (!req.body) {
                callback(new Error("Must provide Acknowledgement DTO."));
            }

            var payload = req.body;
            var merchant_order_id = req.params.merchant_order_id;
            callback(null, payload, merchant_order_id);
        },
        JetService.acknowledgeOrder
    ], _responseFunctionFactory("acknowledge order", res));
};

OrdersResource.shipped = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if (!req.params || !req.params.merchant_order_id) {
                callback(new Error("Must provide a merchant_order_id"));
            }
            if (!req.body) {
                callback(new Error("Must provide Shipped DTO."));
            }

            var payload = req.body;
            var merchant_order_id = req.params.merchant_order_id;
            callback(null, payload, merchant_order_id);
        },
        JetService.shipOrder
    ], _responseFunctionFactory("ship order", res));
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