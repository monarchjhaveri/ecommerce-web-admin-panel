var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({});

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.GET_DETAILS_STARTED:
        case ActionTypes.PRODUCTS.FETCH_ALL_STARTED:
        case ActionTypes.PRODUCTS.EDIT_STARTED:
        case ActionTypes.PRODUCTS.CREATE_STARTED:
             return true;
        case ActionTypes.PRODUCTS.GET_DETAILS_SUCCESS:
        case ActionTypes.PRODUCTS.GET_DETAILS_FAILURE:
        case ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS:
        case ActionTypes.PRODUCTS.FETCH_ALL_FAILURE:
        case ActionTypes.PRODUCTS.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.EDIT_FAILURE:
        case ActionTypes.PRODUCTS.CREATE_SUCCESS:
        case ActionTypes.PRODUCTS.CREATE_FAILURE:
            return false;
        default:
            return state;
    }
};