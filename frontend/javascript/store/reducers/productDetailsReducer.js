var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({});

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.SKUS.GET_DETAILS_SUCCESS:
            return state.set(action.payload.sku, action.payload);
        default:
            return state;
    }
};