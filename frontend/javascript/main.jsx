var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require("./store/store");
var ProductAC = require("./actions/ProductAC");
var OrderAC = require("./actions/OrderAC");
var MerchantAC = require("./actions/MerchantAC");

var ProductsView = require("./views/ProductsView.jsx");
var OrdersView = require("./views/OrdersView.jsx");
var ReturnsView = require("./views/ReturnsView.jsx");
var RefundsView = require("./views/RefundsView.jsx");
var Modals = require("./modals/Modals.jsx");

var ReduxRouter = require("redux-router").ReduxRouter;
var routerStateReducer = require("redux-router").routerStateReducer;
var reduxReactRouter = require("redux-router").reduxReactRouter;
var pushState = require("redux-router").pushState;

var Route = require("react-router").Route;
var IndexRoute = require("react-router").IndexRoute;
var Link = require("react-router").Link;
var IndexLink = require("react-router").IndexLink;

var OrderDetails = require("./components/OrderDetails.jsx");
var OrderAcknowledgement = require("./components/OrderAcknowledgement.jsx");
var OrderShipment = require("./components/OrderShipment.jsx");
var OrderRefund = require("./components/OrderRefund.jsx");

var ReturnDetails = require("./components/ReturnDetails.jsx");
var ReturnComplete = require("./components/ReturnComplete.jsx");

var RefundDetails = require("./components/RefundDetails.jsx");

var unsubscribe = store.subscribe(function() {

});

window.store = store;

MerchantAC.getFulfillmentNodes();

var Layout = React.createClass({
    render: function() {
        return (
            <div className="content-wrapper">
                <div className="view-wrapper">
                    <div className="layout-wrapper">
                        <nav className="navbar navbar-default navbar-fixed-top">
                            <div className="container-fluid">
                                <div className="navbar-header">
                                    <Link className="navbar-brand" to="/">Admin Panel</Link>
                                </div>
                                <div id="navbar" className="navbar-collapse collapse">
                                    <ul className="nav navbar-nav">
                                        <li><Link to="/">Products</Link></li>
                                        <li><Link to="/orders">Orders</Link></li>
                                        <li><Link to="/returns">Returns</Link></li>
                                        <li><Link to="/refunds">Refunds</Link></li>
                                        <li><a href="/file_upload.html">File Upload</a></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                        <div className="navbar navbar-default navbar-fixed-bottom">
                            <div className="container">

                            </div>
                        </div>
                        {this.props.children}
                        <Modals />
                    </div>
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    fetchOrder: function(x,y){
        var merchant_order_id = x.params.merchant_order_id;
        var selectedOrder = store.getState().selectedOrder;
        if (selectedOrder && selectedOrder.merchant_order_id === merchant_order_id) {

        } else {
            OrderAC.getDetails(merchant_order_id);
        }
    },
    render: function() {
        return (
            <div>
                <Provider store={store}>
                    <ReduxRouter>
                        <Route path="/" component={Layout}>
                            <IndexRoute component={ProductsView}/>
                            <Route path="orders" component={OrdersView}>
                                <Route path=":merchant_order_id">
                                    <IndexRoute component={OrderDetails} />
                                    <Route path="acknowledge" component={OrderAcknowledgement} />
                                    <Route path="shipment" component={OrderShipment} />
                                    <Route path="refund" component={OrderRefund} />
                                </Route>
                            </Route>
                            <Route path="returns" component={ReturnsView}>
                                <Route path=":return_url_id">
                                    <IndexRoute component={ReturnDetails} />
                                    <Route path="complete" component={ReturnComplete}/>
                                </Route>
                            </Route>
                            <Route path="refunds" component={RefundsView}>
                                <Route path=":refund_url_id">
                                    <IndexRoute component={RefundDetails} />
                                </Route>
                            </Route>
                        </Route>
                    </ReduxRouter>
                </Provider>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    window.document.getElementById('content')
);