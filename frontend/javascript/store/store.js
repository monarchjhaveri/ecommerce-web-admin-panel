var Immutable = require("immutable");

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var thunk = require("redux-thunk");

var loadingReducer = require("./reducers/loadingReducer");
var selectionReducer = require("./reducers/selectionReducer");
var productsReducer = require("./reducers/productsReducer");

var ActionTypes = require("../actions/ActionTypes");

var initialState = Immutable.Map({
    products: Immutable.List([]),
    loading: true,
    selectedProduct: {}
});

function reducer(state, action) {
    return {
        products: productsReducer(state.products, action),
        loading: loadingReducer(state.loading, action),
        selectedProduct: selectionReducer(state.selectedProduct, action)
    };
}

var createStoreWithMiddeware = applyMiddleware(
    thunk
)(createStore);

var store = createStoreWithMiddeware(reducer, initialState);

module.exports = store;