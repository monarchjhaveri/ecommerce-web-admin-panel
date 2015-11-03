var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var ProductsResource = {};

ProductsResource.list = function(req, res, next) {
    MongoDbHelper.find({}, function(err, data) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get list of products from database", err));
        } else {
            res.send(data);
        }
    })
};

ProductsResource.find = function(req, res, next) {
    MongoDbHelper.find({merchant_sku: req.params.sku}, function(err, data) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get product details from database", err));
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
                res.status(getAppropriateStatusCode(err))
                    .send(createErrorMessage("create product in database", err));
            } else if (data.modifiedCount === 0) {
                res.status(404).send("No record with matching _id found.");
            } else {
                payload._id = data.insertedId.toString();
                res.send(payload);
            }
        });
    }
};

ProductsResource.edit = function(req, res, next) {
    var payload = _filterParams(req.body);
    payload._id = new ObjectID(payload._id);
    if (!ProductValidationHelper.validateProduct(payload)) {
        res.status(400).send("Invalid product specifications.");
    } else {
        MongoDbHelper.update(payload, function(err, data) {
            if (err) {
                console.log(err);
                res.status(getAppropriateStatusCode(err))
                    .send(createErrorMessage("edit product in database", err));
            } else if (data.modifiedCount === 0) {
                res.status(404).send("No record with matching _id found.");
            } else {
                payload._id = payload._id.toString();
                res.send(payload);
            }
        });
    }
};

ProductsResource.delete = function(req, res, next) {
    var payload = _filterParams(req.body);
    payload._id = new ObjectID(payload._id);
    if (!ProductValidationHelper.validateProduct(payload)) {
        res.status(400).send("Invalid product specifications.");
    } else {
        MongoDbHelper.delete(payload, function(err, data) {
            if (err) {
                console.log(err);
                res.status(getAppropriateStatusCode(err))
                    .send(createErrorMessage("create product in database", err));
            } else if (data.modifiedCount === 0) {
                res.status(404).send("No record with matching _id found.");
            } else {
                payload._id = payload._id.toString();
                res.send(payload);
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