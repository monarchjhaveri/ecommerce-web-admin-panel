var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var ProductsResource = {};

ProductsResource.list = function(req, res, next) {
    async.waterfall([
        JetService.getProductsList,
        _synchronizeJetSkuArray
    ], function(err, data) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get list of products from Jet", err));
        } else {
            res.send(data);
        }
    });
    //MongoDbHelper.find({}, function(err, data) {
    //    if (err) {
    //        console.log(err);
    //        res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get list of products from database", err));
    //    } else {
    //        res.send(data);
    //    }
    //})
};

function _synchronizeJetSkuArray(jetSkuArray, callback) {
    async.waterfall([
        MongoDbHelper.getProductsList,
        function(dbProductsList, callback) {
            callback(null, _fillJetSkuArrayWithDbData(jetSkuArray, dbProductsList))
        }
    ], callback)
}

function _fillJetSkuArrayWithDbData(jetSkuArray, dbProductsList) {
    return jetSkuArray.map(function(jetSkuObject) {
       var correspondingDbProduct = dbProductsList.find(function(dbProduct) {
           return dbProduct.merchant_sku === jetSkuObject.sku;
       });
        if (correspondingDbProduct) {
            return correspondingDbProduct;
        } else {
            return {
                merchant_sku: jetSkuObject.sku,
                product_title: "(?)"
            }
        }
    });
}


ProductsResource.find = function(req, res, next) {
    MongoDbHelper.find({merchant_sku: req.params.sku}, function(err, dbProductArray) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage("get product details from database", err));
        } else {
            var dbProduct = dbProductArray[0];
            _synchronizeDbProductWithJetProduct(dbProduct, function(syncErr, syncedData) {
                if (syncErr) {
                    console.log(syncErr);
                    res.status(getAppropriateStatusCode(syncErr)).send(createErrorMessage("synchronize jet.com product data", syncErr));
                } else {
                    res.send(dbProduct);
                }
            });
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

function _synchronizeDbProductWithJetProduct(dbProduct, callback) {
    async.waterfall([
        function(callback) {
            JetService.getDetails(dbProduct.merchant_sku, callback);
        },
        function(jetProduct, callback) {
            try {
                var newDbProduct = _applyDiff(dbProduct, jetProduct);
            } catch (e) {
                callback(e);
                return;
            }
            callback(null, newDbProduct);
        },
        function(newDbProduct, callback) {
            newDbProduct._id = new ObjectID(newDbProduct._id);
            MongoDbHelper.update(newDbProduct, function(updateErr, updateData) {
                if (updateErr) {
                    callback(updateErr);
                } else if (updateData.modifiedCount === 0) {
                    callback(new Error("Failed to update local data with jet.com data."));
                } else {
                    callback(null, newDbProduct);
                }
            });
        }
    ], callback);
}

function _clone(a) {
    return JSON.parse(JSON.stringify(a));
}

function _applyDiff(_dbProduct, jetProduct) {
    var dbProduct = _clone(_dbProduct);
    keys = Object.keys(jetProduct);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        dbProduct[k] = jetProduct[k];
    }
    return dbProduct;
}

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