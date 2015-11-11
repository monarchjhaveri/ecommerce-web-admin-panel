var JetService = require("../services/JetService/JetService");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var MerchantResource = {};

MerchantResource.getFulfillmentNodes = function(req, res, next) {
    JetService.getFulfillmentNodes(function(err, data) {
        if (err) {
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get fulfillment nodes list from Jet.com", err));
        }

        res.send(data);
    })
};

module.exports = MerchantResource;