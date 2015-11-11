var Immutable = require("immutable");
var Constants = require("../../Constants");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({});

module.exports = function ordersFilterReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.INVENTORY.GET_SUCCESS:
            return state.set(action.payload.product.merchant_sku, action.payload.inventory);
        case ActionTypes.PRODUCTS.INVENTORY.GET_FAILURE:
            return state.remove(action.payload.product.merchant_sku);
        default:
            return state;
    }
};