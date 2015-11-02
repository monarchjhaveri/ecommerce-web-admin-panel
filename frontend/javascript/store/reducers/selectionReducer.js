var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = null;

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.SKUS.SELECT:
            return action.payload;
        default:
            return state;
    }
};