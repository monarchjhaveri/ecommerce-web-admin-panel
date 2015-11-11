var Immutable = require("immutable");
var Constants = require("../Constants");

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var compose = require('redux').compose;
var thunk = require("redux-thunk");

var loadingReducer = require("./reducers/loadingReducer");
var selectionReducer = require("./reducers/selectionReducer");
var productsReducer = require("./reducers/productsReducer");
var ordersReducer = require("./reducers/ordersReducer");
var popoversReducer = require("./reducers/popoversReducer");
var productInventoryReducer = require("./reducers/productInventoryReducer");
var ordersFilterReducer = require("./reducers/ordersFilterReducer");
var merchantReducer = require("./reducers/merchantReducer");
var routerStateReducer = require("redux-router").routerStateReducer;

var createHistory = require("history/lib/createHashHistory");
var reduxReactRouter = require("redux-router").reduxReactRouter;

var ActionTypes = require("../actions/ActionTypes");

var initialState = {
    orders: Immutable.Map({}),
    products: Immutable.Map({}),
    loading: true,
    selectedProduct: {},
    selectedOrder: {},
    popovers: Immutable.List([]),
    ordersFilter: Immutable.Map({
        status: Constants.ORDER_STATUS.CREATED
    }),
    merchant: Immutable.Map({
        fulfillmentNodes: null
    }),
    productInventory: Immutable.Map({/*merchant_sku: fulfillment_nodes[] */})
};

function reducer(state, action) {
    return {
        products: productsReducer(state.products, action),
        orders: ordersReducer(state.orders, action),
        loading: loadingReducer(state.loading, action),
        selectedProduct: selectionReducer(state.selectedProduct, action),
        popovers: popoversReducer(state.popovers, action),
        ordersFilter: ordersFilterReducer(state.ordersFilter, action),
        merchant: merchantReducer(state.merchant, action),
        productInventory: productInventoryReducer(state.productInventory, action),
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