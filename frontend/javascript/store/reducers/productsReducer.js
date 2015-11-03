var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.List([]);

module.exports = function skusReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS:
            var map = {};
            for (var i = 0; i < action.payload.length; i++) {
                var p = action.payload[i];
                map[p._id] = p;
            }
            return Immutable.Map(map);
        case ActionTypes.PRODUCTS.EDIT_SUCCESS:
        case ActionTypes.PRODUCTS.CREATE_SUCCESS:
            return state.set(action.payload._id, action.payload);
        case ActionTypes.PRODUCTS.DELETE_SUCCESS:
            return state.remove(action.payload._id);
        default:
            return state instanceof Immutable.Map ?  state : Immutable.Map(state);

    }
};