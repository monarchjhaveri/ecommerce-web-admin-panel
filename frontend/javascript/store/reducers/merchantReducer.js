var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({
    fulfillmentNodes: null
});
var stateKey = "merchant";

module.exports = function merchantReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.MERCHANT.GET_FULFILLMENT_NODES_SUCCESS_SILENTLY:
            return state.set("fulfillmentNodes", action.payload);
        default:
            return state;

    }
};