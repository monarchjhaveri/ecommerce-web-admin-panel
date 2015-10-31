var Immutable = require("immutable");

var createStore = require('redux').createStore;
var productsReducer = require("./reducers/productsReducer");

var ActionTypes = require("../actions/ActionTypes");

var initialState = Immutable.Map({
    products: Immutable.List([])
});

function reducer(state, action) {
    return {
        products: productsReducer(state.products, action)
    };
}

var store = createStore(reducer, initialState);

module.exports = store;