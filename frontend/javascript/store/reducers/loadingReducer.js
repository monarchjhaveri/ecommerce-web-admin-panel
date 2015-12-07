var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = false;

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.GET_DETAILS_STARTED:
        case ActionTypes.PRODUCTS.FETCH_ALL_STARTED:
        case ActionTypes.PRODUCTS.EDIT_STARTED:
        case ActionTypes.PRODUCTS.CREATE_STARTED:
        case ActionTypes.ORDERS.GET_DETAILS_STARTED:
        case ActionTypes.ORDERS.FETCH_ALL_STARTED:
        case ActionTypes.ORDERS.SHIP_STARTED:
        case ActionTypes.RETURNS.GET_DETAILS_STARTED:
        case ActionTypes.RETURNS.FETCH_ALL_STARTED:
        case ActionTypes.RETURNS.COMPLETE_STARTED:
        case ActionTypes.PRODUCTS.INVENTORY.EDIT_STARTED:
        case ActionTypes.PRODUCTS.PRICE.EDIT_STARTED:
             return true;
        case ActionTypes.PRODUCTS.GET_DETAILS_SUCCESS:
        case ActionTypes.PRODUCTS.GET_DETAILS_FAILURE:
        case ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS:
        case ActionTypes.PRODUCTS.FETCH_ALL_FAILURE:
        case ActionTypes.PRODUCTS.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.EDIT_FAILURE:
        case ActionTypes.PRODUCTS.CREATE_SUCCESS:
        case ActionTypes.PRODUCTS.CREATE_FAILURE:
        case ActionTypes.ORDERS.GET_DETAILS_SUCCESS:
        case ActionTypes.ORDERS.GET_DETAILS_FAILURE:
        case ActionTypes.ORDERS.FETCH_ALL_SUCCESS:
        case ActionTypes.ORDERS.FETCH_ALL_FAILURE:
        case ActionTypes.RETURNS.GET_DETAILS_SUCCESS:
        case ActionTypes.RETURNS.GET_DETAILS_FAILURE:
        case ActionTypes.RETURNS.COMPLETE_SUCCESS:
        case ActionTypes.RETURNS.COMPLETE_FAILURE:
        case ActionTypes.RETURNS.FETCH_ALL_SUCCESS:
        case ActionTypes.RETURNS.FETCH_ALL_FAILURE:
        case ActionTypes.ORDERS.ACKNOWLEDGE_SUCCESS:
        case ActionTypes.ORDERS.ACKNOWLEDGE_FAILURE:
        case ActionTypes.ORDERS.SHIP_SUCCESS:
        case ActionTypes.ORDERS.SHIP_FAILURE:
        case ActionTypes.PRODUCTS.INVENTORY.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.INVENTORY.EDIT_FAILURE:
        case ActionTypes.PRODUCTS.PRICE.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.PRICE.EDIT_FAILURE:
            return false;
        default:
            return state;
    }
};