var Immutable = require("immutable");

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var thunk = require("redux-thunk");
var productDetailsReducer = require("./reducers/productDetailsReducer");
var loadingReducer = require("./reducers/loadingReducer");
var selectionReducer = require("./reducers/selectionReducer");
var skusReducer = require("./reducers/skusReducer");

var ActionTypes = require("../actions/ActionTypes");

var initialState = Immutable.Map({
    skus: Immutable.List([]),
    products: Immutable.Map({}),
    loading: true,
    selectedSku: null
});

function reducer(state, action) {
    return {
        skus: skusReducer(state.skus, action),
        productDetails: productDetailsReducer(state.productDetails, action),
        loading: loadingReducer(state.loading, action),
        selectedSku: selectionReducer(state.selectedSku, action)
    };
}

var createStoreWithMiddeware = applyMiddleware(
    thunk
)(createStore);

var store = createStoreWithMiddeware(reducer, initialState);

module.exports = store;