var JetService = require("../services/JetService/JetService");

var JetProductsResource = {};

JetProductsResource.getProductsList = function(req, res, next) {
    JetService.getProductsList(function(err, data) {
        if (err) {
            res.status(500).send("Something went wrong while getting list of products!");
        }

        res.send(data);
    })
};

JetProductsResource.getDetails = function(req, res, next) {
    JetService.getDetails(req.params.sku, function(err, data) {
        if (err) {
            res.status(500).send("Something went wrong while getting product details!");
        }

        res.send(data);
    })
};

module.exports = JetProductsResource;