var SkuParserHelper = require("./SkuParserHelper");
var JetApi = require('jet-api');
var async = require("async");

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

JetService.getDetails = function(sku, callback) {
    _retryIfFailed("getDetails", _getDetails(sku), callback);
};

function _connect(callback) {
    JetApi.authentication.connect(user, pass, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

function _getDetails(sku) {
    return function (callback) {
        JetApi.products.getDetails(sku, authData.id_token, function(getDetailsErr, data){
            if (getDetailsErr) {
                callback(getDetailsErr);
            } else {
                callback(null, data);
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


module.exports = JetService;