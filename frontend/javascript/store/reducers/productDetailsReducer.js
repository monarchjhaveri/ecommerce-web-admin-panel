var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({});

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.SKUS.GET_DETAILS_SUCCESS:
            var newState = state.set(action.payload.merchant_sku, action.payload);
            return newState;
        default:
            return state;
    }
};