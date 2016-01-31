var Immutable = require("immutable");
var Constants = require("../../Constants");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({});

module.exports = function productVariationReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.VARIATION.GET_STARTED:
        case ActionTypes.PRODUCTS.GET_DETAILS_STARTED:
            return Immutable.Map({});
        case ActionTypes.PRODUCTS.VARIATION.GET_SUCCESS:
            return state.set(action.payload.product.merchant_sku, action.payload.variationInfo);
        case ActionTypes.PRODUCTS.VARIATION.GET_FAILURE:
            return state.remove(action.payload.product.merchant_sku);
        default:
            return state;
    }
};