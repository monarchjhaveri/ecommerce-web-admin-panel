var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");

var ProductsResource = {};

ProductsResource.list = function(req, res, next) {
    MongoDbHelper.find({}, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong while getting list of products!");
        } else {
            res.send(data);
        }
    })
};

ProductsResource.find = function(req, res, next) {
    MongoDbHelper.find({merchant_sku: req.params.sku}, function(err, data) {
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong while getting the product details!");
        } else {
            res.send(data);
        }
    })
};


ProductsResource.create = function(req, res, next) {
    var payload = _filterParams(req.body);
    delete payload._id;
    if (!ProductValidationHelper.validateProduct(payload)) {
        res.status(400).send("Invalid product specifications.");
    } else {
        MongoDbHelper.insert(payload, function(err, data) {
            if (err) {
                console.log(err);
                var message = _errorMapperForCreate(err);
                res.status(500).send(message);
            } else if (data.modifiedCount === 0) {
                res.status(404).send("No record with matching _id found.");
            } else {
                res.send(req.body);
            }
        });
    }
};

ProductsResource.edit = function(req, res, next) {
    var payload = _filterParams(req.body);
    if (!ProductValidationHelper.validateProduct(payload)) {
        res.status(400).send("Invalid product specifications.");
    } else {
        MongoDbHelper.update(payload, function(err, data) {
            if (err) {
                console.log(err);
                var message = _errorMapperForCreate(err);
                res.status(500).send(message);
            } else if (data.modifiedCount === 0) {
                res.status(404).send("No record with matching _id found.");
            } else {
                res.send(req.body);
            }
        });
    }
};

function _errorMapperForCreate(err) {
    switch (err.code) {
        case 11000:
            return "An entry with this merchant_sku already exists. Please create a product with a new sku.";
        default:
            return "Unknown error occurred while saving the product. See logs for details.";
            break;
    }
}

var allowedParams = ["_id", "merchant_sku", "product_title", "standard_product_codes", "multipack_quantity"];
function _filterParams(payload) {
    var newObject = {};
    for(var i = 0; i < allowedParams.length; i++) {
        newObject[allowedParams[i]] = payload[allowedParams[i]]
    }
    return newObject;
}

module.exports = ProductsResource;