var Immutable = require("immutable");
var Constants = require("../../Constants");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({
    status: Constants.ORDER_STATUS.CREATED
});

module.exports = function ordersFilterReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.ORDERS.SET_FILTER:
            return state.set("status", action.payload);
        default:
            return state;
    }
};