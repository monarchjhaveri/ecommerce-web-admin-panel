var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = null;

module.exports = function selectedOrderReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.ORDERS.EDIT_SUCCESS:
        case ActionTypes.ORDERS.CREATE_SUCCESS:
        case ActionTypes.ORDERS.SELECT:
            return action.payload;
        case ActionTypes.ORDERS.DELETE_SUCCESS:
            return null;
        default:
            return state;
    }
};