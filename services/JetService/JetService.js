var SkuParserHelper = require("./SkuParserHelper");
var JetApi = require('jet-api');
var async = require("async");

var VALID_ORDER_STATUSES = [];

(function() {
    var keys = Object.keys(JetApi.orders.ORDER_STATUS);
    for (var i = 0; i < keys.length; i++) {
        var statusKey = keys[i];
        VALID_ORDER_STATUSES.push(JetApi.orders.ORDER_STATUS[statusKey]);
    }
})();

var MAX_ATTEMPTS = 2;

// reconnect every 2 hours
var RECONNECT_INTERVAL = 2 * 60 * 60 * 1000;

// if reconnect fails at any point, tries to reconnect every 1 minute until successful
var RECONNECT_INTERVAL_IF_FAILED = 60 * 1000;

var reconnectLoopStarted = false;

var user = null;
var pass = null;
var authData = null;

async.forever(function(next) {
    if (!reconnectLoopStarted) {
        var interval = RECONNECT_INTERVAL_IF_FAILED;
        reconnectLoopStarted = true;
        console.log("Re-auth job against Jet.com started. Next attempt in [%s] milliseconds"
            .replace("%s", interval));
        setTimeout(next, RECONNECT_INTERVAL);
    } else {
        console.log("Attempting to re-auth against Jet.com.");
        _connect(function(err, data) {
           if (err) {
               var interval = RECONNECT_INTERVAL_IF_FAILED;
               _logRemoteError("Reconnect", err);
               console.warn(
                   "Re-auth attempt against Jet.com failed! Will keep retrying every [%i] milliseconds until successful, but if this keeps failing, the app WILL stop functioning."
                       .replace("%s", interval)
               );
               setTimeout(next, interval);
           } else {
               var interval = RECONNECT_INTERVAL;
               console.log("Re-auth attempt against Jet.com successful. Next attempt in [%s] milliseconds."
                   .replace("%s", interval));
               authData = data;
               setTimeout(next, interval);
           }
        });
    }
});

var JetService = {};

JetService.connect = function(_user, _pass) {
    user = _user;
    pass = _pass;
    async.retry(MAX_ATTEMPTS, _connect, function(err, data) {
        if (err) {
            _logRemoteError("connect", err);
        } else {
            authData = data;
        }
    });
};

JetService.getProductsList = function(callback) {
    _retryIfFailed("getProductsList", _getProductsList, callback);
};

JetService.getOrdersListByStatus = function(status, callback) {
    _retryIfFailed("getOrdersListByStatus", _getOrdersListByStatus(status), callback);
};

JetService.getDetails = function(sku, callback) {
    _retryIfFailed("getDetails", _getDetails(sku), callback);
};

JetService.getProductInventory = function(sku, originalCallback) {
    _retryIfFailed("getProductInventory", function(callback) {
        JetApi.products.inventory.list(sku, authData.id_token, function(err, inventory){
            if (err) {
                callback(err);
            } else {
                callback(null, inventory);
            }
        });
    }, originalCallback);
};

JetService.getFulfillmentNodes = function(originalCallback) {
    _retryIfFailed("getFulfillmentNodes", function(callback) {
            JetApi.merchant.getFulfillmentNodes(authData.id_token, function(err, fulfillmentNodes){
                if (err) {
                    callback(err);
                } else {
                    callback(null, fulfillmentNodes);
                }
            });
    }, originalCallback);
};

JetService.editOrCreate = function(productDto, callback) {
    var sendDto = _clone(productDto);
    var sku = productDto.merchant_sku;
    delete sendDto._id;
    delete sendDto.merchant_sku;
    _retryIfFailed("editOrCreate", _editOrCreate(sendDto, sku), function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, productDto);
        }
    });
};

function _connect(callback) {
    JetApi.authentication.connect(user, pass, function(err, data) {
        if (err) {
            console.error("Authentication against Jet.com API FAILED!!!");
            callback(err);
        } else {
            console.log("Authentication against Jet.com API was successful.");
            callback(null, data);
        }
    });
}

function _getDetails(sku) {
    return function (callback) {
        if (!sku) {
            callback(new Error("Sku was undefined."));
            return;
        }
        JetApi.products.getDetails(sku, authData.id_token, function(getDetailsErr, data){
            if (getDetailsErr) {
                callback(getDetailsErr);
            } else {
                callback(null, data);
            }
        });
    }
}

function _editOrCreate(productDto, merchant_sku) {
    return function(callback) {
        if (!productDto) {
            callback(new Error("productDto was undefined"));
            return;
        }
        if (!merchant_sku) {
            callback(new Error("merchant_sku was undefined"));
            return;
        }
        JetApi.products.create(merchant_sku, productDto, authData.id_token, function(createErr, createData) {
            if (createErr) {
                callback(createErr);
            } else {
                callback(null, productDto);
            }
        });
    }
}

function _getProductsList(callback) {
    JetApi.products.list(authData.id_token, function(listErr, listData){
        if (listErr) {
            callback(listErr);
        } else {
            var skus = SkuParserHelper.extractSkuFromUrls(listData.sku_urls);
            var skuObjects = skus.map(function(d) {
                return {
                    sku: d
                }
            });
            callback(null, skuObjects);
        }
    });
}

function _getOrdersListByStatus(status) {
    return function(callback) {
        if (!status || VALID_ORDER_STATUSES.indexOf(status) < 0) {
            callback(new Error("Unknown order status [%s]".replace("%s", status)));
        }
        JetApi.orders.listByStatus(status, authData.id_token, function(listErr, listData){
            if (listErr) {
                callback(listErr);
            } else {
                callback(null, _extractMerchantOrderIds(listData));
            }
        });
    }
}

function _retryIfFailed(functionName, functionInstance, callback) {
    async.retry(MAX_ATTEMPTS, functionInstance, function(err, data) {
        if (err) {
            _logRemoteError(functionName, err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

function _logRemoteError(fnName, err) {
    console.error("Function [%fn] failed with this message: [%msg]"
            .replace("%fn", fnName)
            .replace("%msg", err.message)
    );
    console.error(err.stack);
}

var MERCHANT_ORDER_ID_REGEX = /orders\/withoutShipmentDetail\/(.*)/;
function _extractMerchantOrderIds(orderStatusArray) {
    return orderStatusArray.order_urls.map(function(url) {
        var match = url.match(MERCHANT_ORDER_ID_REGEX);
        if (match === null || match.length <= 1) {
            return null;
        } else {
            return {
                merchant_order_id: match[1]
            };
        }
    });
}


module.exports = JetService;

function _clone(a) {
    return JSON.parse(JSON.stringify(a));
}