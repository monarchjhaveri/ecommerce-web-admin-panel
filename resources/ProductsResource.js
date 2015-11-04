var JetService = require("../services/JetService/JetService");
var ProductValidationHelper = require("../helpers/ProductValidationHelper");
var MongoDbHelper = require("../database/MongoDbHelper");
var ObjectID = require("mongodb").ObjectID;
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var ProductsResource = {};

ProductsResource.list = function(req, res, next) {
    async.waterfall([
        JetService.getProductsList,
        _synchronizeJetSkuArray
    ], _responseFunctionFactory("get list of products", res));
};


ProductsResource.find = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if (!req.params && req.params.sku) {
                callback(new Error("Must provide a merchant_sku"))
            } else {
                var merchant_sku = req.params.sku;
                callback(null, merchant_sku);
            }
        },
        _getJetDetailsForMerchantSku,
        _upsertJetProductAndReturnSku,
        _findProductInDatabaseBySku
    ], _responseFunctionFactory("get product", res));
};

function _responseFunctionFactory(action, res) {
    return function(err, data) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage(action, err));
        } else {
            res.send(data);
        }
    }
}

function _upsertJetProductAndReturnSku(jetProduct, callback) {
    MongoDbHelper.upsert(jetProduct, function(upsertErr, upsertedData) {
        if (upsertErr) {
            callback(upsertErr);
        } else {
            callback(null, jetProduct.merchant_sku);
        }
    });
}


ProductsResource.createOrEdit = function(req, res, next) {
    async.waterfall([
        function(callback) {
            // parse body and create an insertable object without _id
            var payload = _parseBody(req.body);
            delete payload._id;
            callback(null, payload);
        },
        function(payload, callback) {
            // edit or create against jet
            JetService.editOrCreate(payload, function(ecErr, ecData) {
                if (ecErr) {
                    callback(ecErr);
                } else {
                    callback(null, payload.merchant_sku);
                }
            })
        },
        _getJetDetailsForMerchantSku,
        _upsertJetProductAndReturnSku,
        _findProductInDatabaseBySku
    ], _responseFunctionFactory("create product", res));
};

function _getJetDetailsForMerchantSku(merchantSku, callback) {
    // jet Details For Merchant Sku
    JetService.getDetails(merchantSku, callback);
}
// ========= Above this line is good.

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

function _findEditedProductInDatabaseOrReturnNull(editedProduct, callback) {
    MongoDbHelper.find({merchant_sku: editedProduct.merchant_sku}, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]);
        }
    });
}

function _putAgainstJet(productDto) {
    return function(callback) {
        JetService.editOrCreate(productDto, function(editOrCreateErr, editOrCreateData) {
            if (editOrCreateErr) {
                callback(editOrCreateErr);
            } else {
                callback(null, productDto);
            }
        })
    };
}

function _findProductInDatabaseBySku(merchantSku, callback) {
    MongoDbHelper.find({merchant_sku: merchantSku}, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data[0]);
        }
    });
}

function _synchronizeDbProductWithJetProduct(_dbProduct, _sku, callback) {
    async.waterfall([
        function(callback) {
            if (!_dbProduct) {
                var dummyObject = {
                    merchant_sku: _sku
                };
                MongoDbHelper.insert(dummyObject, function(insertErr, insertData) {
                    if (insertErr) {
                        console.error(insertErr);
                        callback(insertErr);
                        return;
                    }
                    if (insertData.insertedCount != 1) {
                        console.error(insertData);
                        callback(new Error("Failed to insert stub product into DB! More info above."));
                        return;
                    }
                    callback(null, dummyObject);
                });
            } else {
                callback(null, _dbProduct);
            }
        },
        function(dbProduct, callback) {
            JetService.getDetails(dbProduct.merchant_sku, function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, dbProduct, data)
                }
            });
        },
        function(dbProduct, jetProduct, callback) {
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

function _parseBody(body) {
    if (!body) {
        return body;
    }
    if (body.multipack_quantity) {
        var num = Number(body.multipack_quantity);
        if (!Number.isNaN(num)) {
            body.multipack_quantity = num;
        }
    }
    return body;
}

module.exports = ProductsResource;