var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = null;

module.exports = function selectedRefundReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.REFUNDS.SELECT:
            return action.payload;
        case ActionTypes.REFUNDS.CLEAR_SELECTION:
            return {};
        default:
            return state;
    }
};