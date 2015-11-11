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
        default:
            return state;
    }
};