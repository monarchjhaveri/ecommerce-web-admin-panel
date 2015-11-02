var Immutable = require("immutable");

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var thunk = require("redux-thunk");
var productDetailsReducer = require("./reducers/productDetailsReducer");
var skusReducer = require("./reducers/skusReducer");

var ActionTypes = require("../actions/ActionTypes");

var initialState = Immutable.Map({
    skus: Immutable.List([]),
    products: Immutable.Map({}),
    loading: true
});

function reducer(state, action) {
    return {
        skus: skusReducer(state.skus, action),
        productDetails: productDetailsReducer(state.productDetails, action),
        loading: true
    };
}

var createStoreWithMiddeware = applyMiddleware(
    thunk
)(createStore);

var store = createStoreWithMiddeware(reducer, initialState);

module.exports = store;