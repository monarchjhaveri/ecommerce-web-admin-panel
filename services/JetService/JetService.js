var SkuParserHelper = require("./SkuParserHelper");
var JetApi = require('jet-api');
var async = require("async");

var VALID_ORDER_STATUSES = _objectValuesToArray(JetApi.orders.ORDER_STATUS);
var VALID_RETURN_STATUSES = _objectValuesToArray(JetApi.returns.RETURN_STATUS);
var VALID_REFUND_STATUSES = _objectValuesToArray(JetApi.refunds.REFUND_STATUS);


function _objectValuesToArray(_enum) {
    var arr = [];
    var keys = Object.keys(_enum);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        arr.push(_enum[key]);
    }
    return arr;
}

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

JetService.getOrderDetails = function(status, callback) {
    _retryIfFailed("getOrderDetails", _getOrderDetails(status), callback);
};

JetService.getReturnsListByStatus = function(status, callback) {
    _retryIfFailed("getReturnsListByStatus", _getReturnsListByStatus(status), callback);
};

JetService.getReturnDetails = function(id, callback) {
    _retryIfFailed("getReturnDetails", _getReturnDetails(id), callback);
};

JetService.getRefundsListByStatus = function(status, callback) {
    _retryIfFailed("getRefundsListByStatus", _getRefundsListByStatus(status), callback);
};

JetService.getRefundDetails = function(id, callback) {
    _retryIfFailed("getRefundDetails", _getRefundDetails(id), callback);
};

JetService.getDetails = function(sku, callback) {
    _retryIfFailed("getDetails", _getDetails(sku), callback);
};

JetService.getNodeAttributes = function(nodeId, callback) {
    _retryIfFailed("getNodeAttributes", _getNodeAttributes(nodeId), callback);
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

JetService.updateProductInventory = function(fulfillmentNodesDto, sku, originalCallback) {
    _retryIfFailed("updateProductInventory", _editInventory(fulfillmentNodesDto, sku), originalCallback);
};

JetService.acknowledgeOrder = function(acknowledgeItemDto, merchant_order_id, originalCallback) {
    _retryIfFailed("acknowledgeOrder", function(callback) {
        JetApi.orders.acknowledge(merchant_order_id, acknowledgeItemDto, authData.id_token, function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    function(err, data) {
        if (err) {
            originalCallback(err);
        } else {
            var InventorySyncJob = require("../../jobs/InventorySyncJob");
            InventorySyncJob.adjustInventoryAccordingToOrder(merchant_order_id);
            originalCallback(null, data);
        }
    });
};

JetService.shipOrder = function(shipped_dto, merchant_order_id, originalCallback) {
    _retryIfFailed("shipOrder", function(callback) {
        JetApi.orders.shipped(merchant_order_id, shipped_dto, authData.id_token, function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    },
    function(err, data) {
        if (err) {
            originalCallback(err);
        } else {
            var InventorySyncJob = require("../../jobs/InventorySyncJob");
            if (shipped_dto && shipped_dto.shipments) {
                shipped_dto.shipments.forEach(function(shipment) {
                    if (shipment.shipment_items) {
                        shipment.shipment_items.forEach(function(shipment_item) {
                            InventorySyncJob.adjustInventory(shipment_item.merchant_sku, shipment_item.response_shipment_cancel_qty);
                        })
                    }
                })
            }
            originalCallback(null, data);
        }
    });
};

JetService.completeReturn = function(completed_return_dto, return_url_id, originalCallback) {
    _retryIfFailed("completeReturn", function(callback) {
        JetApi.returns.complete(return_url_id, completed_return_dto, authData.id_token, callback);
    }, originalCallback);
};

JetService.completeRefund = function(refund_dto, order_id, alt_refund_id, originalCallback) {
    _retryIfFailed("completeRefund", function(callback) {
        JetApi.refunds.post(order_id, alt_refund_id, refund_dto, authData.id_token, callback);
    }, originalCallback);
};

JetService.getProductPrice = function(sku, originalCallback) {
    _retryIfFailed("getProductInventory", function(callback) {
        JetApi.products.price.list(sku, authData.id_token, function(err, inventory){
            if (err) {
                callback(err);
            } else {
                callback(null, inventory);
            }
        });
    }, originalCallback);
};

JetService.updateProductPrice = function(priceDto, sku, originalCallback) {
    _retryIfFailed("updateProductPrice", _editPrice(priceDto, sku), originalCallback);
};

JetService.updateProductVariation = function(variationDto, sku, originalCallback) {
    _retryIfFailed("updateProductVariation", _editVariation(variationDto, sku), originalCallback);
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

JetService.isLoggedIn = function() {
    return authData && authData.id_token;
};

JetService.fileUpload = {
    getFileUploadToken: function getFileUploadToken(callback) {
        _retryIfFailed("getFileUploadToken", function(innerCb) {
            JetApi.fileUpload.getFileUploadToken(authData.id_token, innerCb);
        }, callback);
    },
    uploadFile: function uploadFile(filename, gzippedFileData, url, callback) {
        _retryIfFailed("uploadFile", function(innerCb) {
            JetApi.fileUpload.uploadFile(filename, gzippedFileData, url, innerCb);
        }, callback);
    },
    notifyJet: function notifyJet(filename, filetype, uploadToken, callback) {
        _retryIfFailed("notifyJet", function(innerCb) {
            JetApi.fileUpload.notifyJet(authData.id_token, filename, filetype, uploadToken, innerCb);
        }, callback);
    },
    getFileUploadStatus: function getFileUploadStatus(jetFileId, callback) {
        _retryIfFailed("getFileUploadStatus", function(innerCb) {
            JetApi.fileUpload.status(authData.id_token, jetFileId, innerCb);
        }, callback);
    },
};

function _editInventory(fulfillmentNodesDto, merchant_sku) {
    return function(callback) {
        if (!fulfillmentNodesDto) {
            callback(new Error("fulfillmentNodesDto was undefined"));
            return;
        }
        if (!merchant_sku) {
            callback(new Error("merchant_sku was undefined"));
            return;
        }
        JetApi.products.inventory.update(merchant_sku, fulfillmentNodesDto, authData.id_token, function(createErr, createData) {
            if (createErr) {
                callback(createErr);
            } else {
                callback(null, fulfillmentNodesDto);
            }
        });
    }
}

function _editPrice(priceDto, merchant_sku) {
    return function(callback) {
        if (!priceDto) {
            callback(new Error("priceDto was undefined"));
            return;
        }
        if (!merchant_sku) {
            callback(new Error("merchant_sku was undefined"));
            return;
        }
        JetApi.products.price.update(merchant_sku, priceDto, authData.id_token, function(createErr, createData) {
            if (createErr) {
                callback(createErr);
            } else {
                callback(null, priceDto);
            }
        });
    }
}

function _editVariation(variationDto, merchant_sku) {
    return function(callback) {
        if (!variationDto) {
            callback(new Error("variationDto was undefined"));
            return;
        }
        if (!merchant_sku) {
            callback(new Error("merchant_sku was undefined"));
            return;
        }
        JetApi.products.variation.update(merchant_sku, variationDto, authData.id_token, function(createErr, createData) {
            if (createErr) {
                callback(createErr);
            } else {
                callback(null, variationDto);
            }
        });
    }
}

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
        } else if(!(authData && authData.id_token)) {
            callback(new Error("Not authenticated yet."));
        } else {
            JetApi.orders.listByStatus(status, authData.id_token, function(listErr, listData){
                if (listErr) {
                    callback(listErr);
                } else {
                    callback(null, _extractMerchantOrderIds(listData));
                }
            });
        }
    }
}


function _getReturnsListByStatus(status) {
    return function(callback) {
        if (!status || VALID_RETURN_STATUSES.indexOf(status) < 0) {
            callback(new Error("Unknown return status [%s]".replace("%s", status)));
        } else {
            JetApi.returns.listByStatus(status, authData.id_token, function(listErr, listData){
                if (listErr) {
                    callback(listErr);
                } else {
                    callback(null, _extractReturnIds(listData));
                }
            });
        }
    }
}

function _getRefundsListByStatus(status) {
    return function(callback) {
        if (!status || VALID_REFUND_STATUSES.indexOf(status) < 0) {
            callback(new Error("Unknown refund status [%s]".replace("%s", status)));
        } else {
            JetApi.refunds.listByStatus(encodeURIComponent(status), authData.id_token, function(listErr, listData){
                if (listErr) {
                    callback(listErr);
                } else {
                    callback(null, _extractRefundIds(listData));
                }
            });
        }
    }
}

function _getOrderDetails(merchant_order_id) {
    return function (callback) {
        if (!merchant_order_id) {
            callback(new Error("Merchant order ID was undefined."));
            return;
        }
        JetApi.orders.getDetails(merchant_order_id, authData.id_token, function(getDetailsErr, data){
            if (getDetailsErr) {
                callback(getDetailsErr);
            } else {
                callback(null, data);
            }
        });
    }
}

function _getReturnDetails(return_url_id) {
    return function (callback) {
        if (!return_url_id) {
            callback(new Error("return_url_id was undefined."));
        } else {
            JetApi.returns.getDetails(return_url_id, authData.id_token, callback);
        }
    }
}

function _getRefundDetails(refund_url_id) {
    return function (callback) {
        if (!refund_url_id) {
            callback(new Error("refund_url_id was undefined."));
        } else {
            JetApi.refunds.getDetails(refund_url_id, authData.id_token, callback);
        }
    }
}

function _getNodeAttributes(nodeId) {
    return function (callback) {
        if (!nodeId) {
            callback(new Error("nodeId was undefined."));
        } else {
            JetApi.taxonomy.getNodeAttributes(nodeId, authData.id_token, callback);
        }
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

var RETURN_URL_ID_REGEX = /returns\/state\/(.*)/;
function _extractReturnIds(returnsArray) {
    return returnsArray.return_urls.map(function(url) {
        var match = url.match(RETURN_URL_ID_REGEX);
        if (match === null || match.length <= 1) {
            return null;
        } else {
            return {
                return_url_id: match[1]
            };
        }
    });
}

var REFUND_URL_ID_REGEX = /refunds\/state\/(.*)/;
function _extractRefundIds(returnsArray) {
    return returnsArray.refund_urls.map(function(url) {
        var match = url.match(REFUND_URL_ID_REGEX);
        if (match === null || match.length <= 1) {
            return null;
        } else {
            return {
                refund_url_id: match[1]
            };
        }
    });
}


module.exports = JetService;

function _clone(a) {
    return JSON.parse(JSON.stringify(a));
}