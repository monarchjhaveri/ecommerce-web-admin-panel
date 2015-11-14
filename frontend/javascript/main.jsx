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
var Modals = require("./modals/Modals.jsx");

var ReduxRouter = require("redux-router").ReduxRouter;
var routerStateReducer = require("redux-router").routerStateReducer;
var reduxReactRouter = require("redux-router").reduxReactRouter;
var pushState = require("redux-router").pushState;

var Route = require("react-router").Route;
var IndexRoute = require("react-router").IndexRoute;
var Link = require("react-router").Link;
var IndexLink = require("react-router").IndexLink;

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
        OrderAC.getDetails(merchant_order_id);
        console.log(merchant_order_id);
    },
    render: function() {
        return (
            <div>
                <Provider store={store}>
                    <ReduxRouter>
                        <Route path="/" component={Layout}>
                            <IndexRoute component={ProductsView}/>
                            <Route path="orders" component={OrdersView}>
                                <Route path=":merchant_order_id" component={OrdersView} onEnter={this.fetchOrder}/>
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