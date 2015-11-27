var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.List([]);
var stateKey = "merchant_return_authorization_id";

module.exports = function ordersReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.RETURNS.FETCH_ALL_SUCCESS:
            var map = {};
            for (var i = 0; i < action.payload.length; i++) {
                var p = action.payload[i];
                map[p[stateKey]] = p;
            }
            return Immutable.Map(map);
        case ActionTypes.RETURNS.GET_DETAILS_SUCCESS:
            return state.set(action.payload[stateKey], action.payload);
        default:
            return state instanceof Immutable.Map ?  state : Immutable.Map(state);

    }
};