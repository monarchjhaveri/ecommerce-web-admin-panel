var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.List([]);
var stateKey = "merchant_sku";

module.exports = function skusReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS:
            var map = {};
            for (var i = 0; i < action.payload.length; i++) {
                var p = action.payload[i];
                map[p[stateKey]] = p;
            }
            return Immutable.Map(map);
        case ActionTypes.PRODUCTS.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.CREATE_SUCCESS:
        case ActionTypes.PRODUCTS.GET_DETAILS_SUCCESS:
            return state.set(action.payload[stateKey], action.payload);
        case ActionTypes.PRODUCTS.DELETE_SUCCESS:
            return state.remove(action.payload[stateKey]);
        default:
            return state instanceof Immutable.Map ?  state : Immutable.Map(state);

    }
};