var Immutable = require("immutable");
var ActionTypes = require("../../actions/ActionTypes");

var defaultState = Immutable.Map({});

module.exports = function productDetailsReducer(state, action) {
    if (typeof state === 'undefined') {
        return defaultState;
    }

    switch (action.type) {
        case ActionTypes.SKUS.GET_DETAILS_STARTED:
        case ActionTypes.SKUS.FETCH_ALL_STARTED:
             return true;
        case ActionTypes.SKUS.GET_DETAILS_SUCCESS:
        case ActionTypes.SKUS.GET_DETAILS_FAILURE:
        case ActionTypes.SKUS.FETCH_ALL_SUCCESS:
        case ActionTypes.SKUS.FETCH_ALL_FAILURE:
            return false;
        default:
            return state;
    }
};