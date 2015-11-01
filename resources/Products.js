var JetService = require("../services/JetService/JetService");

var Products = {};

Products.getAllSkus = function(req, res, next) {
    JetService.getAllSkus(function(err, data) {
        if (err) {
            throw new Error();
        }

        res.send(data);
    })
};

module.exports = Products;