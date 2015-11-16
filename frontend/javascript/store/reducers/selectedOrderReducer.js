var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = null;

module.exports = function selectedOrderReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.ORDERS.SELECT:
            return action.payload;
        case ActionTypes.ORDERS.CLEAR_SELECTION:
            return {};
        default:
            return state;
    }
};