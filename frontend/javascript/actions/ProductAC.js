var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");

var ProductAC = {
    fetchAll: function() {
        return function(dispatch) {
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
                    _createPopover(request, Constants.POPOVER_TYPES.ERROR, dispatch);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        };
    },
    edit: function(product) {
        return function(dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products",
                data: product,
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    _createPopover(request, Constants.POPOVER_TYPES.ERROR, dispatch);
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
        }
    },
    create: function(product) {
        return function(dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.CREATE_STARTED
            });
            $.ajax({
                method: "POST",
                url: "api/products",
                data: product,
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.CREATE_FAILURE,
                        payload: error
                    });
                    _createPopover(request, Constants.POPOVER_TYPES.ERROR, dispatch);
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
        }
    },
    delete: function(product) {
        return function(dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.DELETE_STARTED
            });
            $.ajax({
                method: "DELETE",
                url: "api/products/:sku".replace(":sku", product._id),
                data: product,
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.DELETE_FAILURE,
                        payload: error
                    });
                    _createPopover(request, Constants.POPOVER_TYPES.ERROR, dispatch);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.DELETE_SUCCESS,
                        payload: data
                    });
                }
            });
        }
    },
    getDetails: function(product) {
        return function(dispatch) {
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
                    _createPopover(request, Constants.POPOVER_TYPES.ERROR, dispatch);
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
        }
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