var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = null;

module.exports = function selectedReturnReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.RETURNS.SELECT:
            return action.payload;
        case ActionTypes.RETURNS.CLEAR_SELECTION:
            return {};
        default:
            return state;
    }
};