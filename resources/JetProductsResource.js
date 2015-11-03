var JetService = require("../services/JetService/JetService");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var JetProductsResource = {};

JetProductsResource.getProductsList = function(req, res, next) {
    JetService.getProductsList(function(err, data) {
        if (err) {
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get sku list from Jet.com", err));
        }

        res.send(data);
    })
};

JetProductsResource.getDetails = function(req, res, next) {
    JetService.getDetails(req.params.sku, function(err, data) {
        if (err) {
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get sku details from Jet.com", err));
        }

        res.send(data);
    })
};


module.exports = JetProductsResource;