var Immutable = require("immutable");

var createStore = require('redux').createStore;
var productsReducer = require("./reducers/productsReducer");
var skusReducer = require("./reducers/skusReducer");

var ActionTypes = require("../actions/ActionTypes");

var initialState = Immutable.Map({
    skus: Immutable.List([]),
    products: Immutable.Map({})
});

function reducer(state, action) {
    return {
        skus: skusReducer(state.skus, action),
        products: productsReducer(state.products, action)
    };
}

var store = createStore(reducer, initialState);

module.exports = store;