var JetService = require("../services/JetService/JetService");

var JetProductsResource = {};

JetProductsResource.getProductsList = function(req, res, next) {
    JetService.getProductsList(function(err, data) {
        if (err) {
            res.status(500).send(_createErrorMessage("getProductsList", err));
        }

        res.send(data);
    })
};

JetProductsResource.getDetails = function(req, res, next) {
    JetService.getDetails(req.params.sku, function(err, data) {
        if (err) {
            res.status(500).send(_createErrorMessage("getDetails", err));
        }

        res.send(data);
    })
};

function _createErrorMessage(functionName, err) {
    return "Something went wrong while calling [%functionName]. Error Message was: [%errorMessage]"
        .replace("%functionName", functionName)
        .replace("%errorMessage", err.message);
}

module.exports = JetProductsResource;