var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
//var store = require("../store/store");
var PopoverAC = require("./PopoverAC");

var ProductAC = {
    fetchAll: function() {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/products",
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    edit: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(product),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    //dispatch({
                    //    type: ActionTypes.PRODUCTS.EDIT_SUCCESS,
                    //    payload: data
                    //});
                    setTimeout(function() {
                        dispatch(ProductAC.getDetails(product));
                    }, 500);
                }
            });
        });
    },
    create: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.CREATE_STARTED
            });
            $.ajax({
                method: "POST",
                url: "api/products",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(product),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.CREATE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    //dispatch({
                    //    type: ActionTypes.PRODUCTS.CREATE_SUCCESS,
                    //    payload: data
                    //});
                    setTimeout(function() {
                        dispatch(ProductAC.getDetails(product));
                    }, 500);
                }
            });
        });
    },
    delete: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.DELETE_STARTED
            });
            $.ajax({
                method: "DELETE",
                url: "api/products/:sku".replace(":sku", product._id),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(product),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.DELETE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.DELETE_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    getDetails: function(product) {
        ProductAC.getInventory(product);
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.GET_DETAILS_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/products/:sku"
                    .replace(":sku", product.merchant_sku),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.GET_DETAILS_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.GET_DETAILS_SUCCESS,
                        payload: data
                    });
                    dispatch({
                        type: ActionTypes.PRODUCTS.SELECT,
                        payload: data
                    });
                }
            });
        });
    },
    getInventory: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.INVENTORY.GET_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/products/:sku/inventory"
                    .replace(":sku", product.merchant_sku),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.GET_FAILURE,
                        payload: {
                            product: product,
                            error: error
                        }
                    });
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.GET_SUCCESS,
                        payload: {
                            product: product,
                            inventory: data
                        }
                    });
                }
            });
        });
    },
    editInventory: function(editInventoryObject) {
        var product = editInventoryObject.product;
        var merchant_sku = product &&  product.merchant_sku;
        var payload = editInventoryObject.payload;
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.INVENTORY.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products/{id}/inventory".replace("{id}", merchant_sku),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(payload),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    PopoverAC.displayError(request.responseText);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.EDIT_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    openEditorToCreate: function() {
        return {
            type: ActionTypes.PRODUCTS.SELECT,
            payload: {}
        }
    }
};

var ERROR_TIMEOUT = 10 * 1000; // 10 seconds

/**
 *
 * @param {!String} message
 * @param {!String} type
 * @param {!function} dispatch
 * @private
 */
function _createPopover(request, type, dispatch) {
    var message = request.responseText;
    var popoverId = Math.random();
    dispatch({
        type: ActionTypes.POPOVER.DISPLAY_POPOVER,
        payload: {
            popoverId: popoverId,
            type: type,
            message: message
        }
    });
    setTimeout(function() {
        dispatch({
            type: ActionTypes.POPOVER.CLEAR_POPOVER,
            payload: popoverId
        });
    }, ERROR_TIMEOUT);
}

module.exports = ProductAC;