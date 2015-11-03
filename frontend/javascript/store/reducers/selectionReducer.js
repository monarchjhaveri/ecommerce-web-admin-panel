var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = null;

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.CREATE_SUCCESS:
        case ActionTypes.PRODUCTS.SELECT:
            return action.payload;
        case ActionTypes.PRODUCTS.DELETE_SUCCESS:
            return null;
        default:
            return state;
    }
};