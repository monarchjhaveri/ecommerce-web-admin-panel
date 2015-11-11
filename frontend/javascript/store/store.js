var Immutable = require("immutable");

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var compose = require('redux').compose;
var thunk = require("redux-thunk");

var loadingReducer = require("./reducers/loadingReducer");
var selectionReducer = require("./reducers/selectionReducer");
var productsReducer = require("./reducers/productsReducer");
var ordersReducer = require("./reducers/ordersReducer");
var popoversReducer = require("./reducers/popoversReducer");
var routerStateReducer = require("redux-router").routerStateReducer;

var createHistory = require("history").createHistory;
var reduxReactRouter = require("redux-router").reduxReactRouter;

var ActionTypes = require("../actions/ActionTypes");

var initialState = Immutable.Map({
    orders: Immutable.Map({}),
    products: Immutable.Map({}),
    loading: true,
    selectedProduct: {},
    selectedOrder: {},
    popovers: Immutable.List([])
});

function reducer(state, action) {
    return {
        products: productsReducer(state.products, action),
        orders: ordersReducer(state.orders, action),
        loading: loadingReducer(state.loading, action),
        selectedProduct: selectionReducer(state.selectedProduct, action),
        popovers: popoversReducer(state.popovers, action),
        router: routerStateReducer(state.router, action)
    };
}

var createStoreWithMiddeware = applyMiddleware(
    thunk
)(createStore);

var store = compose(
    applyMiddleware(thunk),
    reduxReactRouter({createHistory})
)(createStore)(reducer, initialState);


module.exports = store;