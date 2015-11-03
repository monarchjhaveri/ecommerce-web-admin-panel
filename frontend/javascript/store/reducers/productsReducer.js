var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.List([]);

module.exports = function skusReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS:
            return Immutable.List(action.payload);
        default:
            return state;
    }
};