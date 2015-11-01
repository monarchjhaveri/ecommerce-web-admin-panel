var JetService = require("../services/JetService/JetService");

var Products = {};

Products.getProductsList = function(req, res, next) {
    JetService.getProductsList(function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong while getting list of skus!");
        }

        res.send(data);
    })
};

Products.getDetails = function(req, res, next) {
    JetService.getDetails(req.params.sku, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong while getting product details!");
        }

        res.send(data);
    })
};

module.exports = Products;