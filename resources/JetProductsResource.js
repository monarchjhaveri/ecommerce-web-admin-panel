var JetService = require("../services/JetService/JetService");

var JetProductsResource = {};

JetProductsResource.getProductsList = function(req, res, next) {
    JetService.getProductsList(function(err, data) {
        if (err) {
            res.status(500).send(_createErrorMessage("get sku list from Jet.com", err));
        }

        res.send(data);
    })
};

JetProductsResource.getDetails = function(req, res, next) {
    JetService.getDetails(req.params.sku, function(err, data) {
        if (err) {
            res.status(500).send(_createErrorMessage("get sku details from Jet.com", err));
        }

        res.send(data);
    })
};

function _createErrorMessage(action, err) {
    return "Failed to %action: %errorMessage"
        .replace("%action", action)
        .replace("%errorMessage", err.message);
}

module.exports = JetProductsResource;