var Immutable = require("immutable");

var defaultState = Immutable.List([]);

module.exports = function productsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.LIST:
            return Immutable.List(action.payload);
        default:
            return state;
    }
};