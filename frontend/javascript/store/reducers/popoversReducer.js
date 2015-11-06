var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.List([]);

module.exports = function popoverReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.POPOVER.DISPLAY_POPOVER:
            if (!action.payload) {
                return state;
            } else {
                return state.push(action.payload);
            }
        case ActionTypes.POPOVER.CLEAR_POPOVER:
            if (!action.payload) {
                return state;
            } else {
                return state.filter(function(d) {
                    return d.popoverId !== action.payload;
                })
            }
        default:
            return state;
    }
};