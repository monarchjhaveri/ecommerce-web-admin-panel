var Immutable = require("immutable");
var Constants = require("../Constants");

var createStore = require('redux').createStore;
var applyMiddleware = require('redux').applyMiddleware;
var compose = require('redux').compose;
var thunk = require("redux-thunk");

var loadingReducer = require("./reducers/loadingReducer");
var selectedProductReducer = require("./reducers/selectedProductReducer");
var selectedOrderReducer = require("./reducers/selectedOrderReducer");
var selectedReturnReducer= require("./reducers/selectedReturnReducer");
var selectedRefundReducer= require("./reducers/selectedRefundReducer");
var productsReducer = require("./reducers/productsReducer");
var ordersReducer = require("./reducers/ordersReducer");
var returnsReducer = require("./reducers/returnsReducer");
var refundsReducer = require("./reducers/refundsReducer");
var popoversReducer = require("./reducers/popoversReducer");
var productInventoryReducer = require("./reducers/productInventoryReducer");
var productPriceReducer = require("./reducers/productPriceReducer");
var ordersFilterReducer = require("./reducers/ordersFilterReducer");
var returnsFilterReducer = require("./reducers/returnsFilterReducer");
var refundsFilterReducer = require("./reducers/refundsFilterReducer");
var merchantReducer = require("./reducers/merchantReducer");
var routerStateReducer = require("redux-router").routerStateReducer;

var createHistory = require("history/lib/createHashHistory");
var reduxReactRouter = require("redux-router").reduxReactRouter;

var ActionTypes = require("../actions/ActionTypes");

var initialState = {
    orders: Immutable.Map({}),
    products: Immutable.Map({}),
    returns: Immutable.Map({}),
    refunds: Immutable.Map({}),
    loading: false,
    selectedProduct: null,
    selectedOrder: {},
    selectedReturn: {},
    selectedRefund: {},
    popovers: Immutable.List([]),
    ordersFilter: Immutable.Map({
        status: Constants.ORDER_STATUS.ACKNOWLEDGED
    }),
    returnsFilter: Immutable.Map({
        status: Constants.RETURN_STATUS.ACKNOWLEDGED
    }),
    refundsFilter: Immutable.Map({
        status: Constants.REFUND_STATUS.CREATED
    }),
    merchant: Immutable.Map({
        fulfillmentNodes: null
    }),
    productInventory: Immutable.Map({/*merchant_sku: objects[] */}),
    productPrice: Immutable.Map({/*merchant_sku: objects[] */})
};

function reducer(state, action) {
    return {
        products: productsReducer(state.products, action),
        orders: ordersReducer(state.orders, action),
        returns: returnsReducer(state.returns, action),
        refunds: refundsReducer(state.refunds, action),
        loading: loadingReducer(state.loading, action),
        selectedProduct: selectedProductReducer(state.selectedProduct, action),
        selectedOrder: selectedOrderReducer(state.selectedOrder, action),
        selectedReturn: selectedReturnReducer(state.selectedReturn, action),
        selectedRefund: selectedRefundReducer(state.selectedRefund, action),
        popovers: popoversReducer(state.popovers, action),
        ordersFilter: ordersFilterReducer(state.ordersFilter, action),
        returnsFilter: returnsFilterReducer(state.returnsFilter, action),
        refundsFilter: refundsFilterReducer(state.refundsFilter, action),
        merchant: merchantReducer(state.merchant, action),
        productInventory: productInventoryReducer(state.productInventory, action),
        productPrice: productPriceReducer(state.productPrice, action),
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