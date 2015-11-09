var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require("./store/store");
var ProductAC = require("./actions/ProductAC");
var Header = require("./layout/Header");
var Footer = require("./layout/Footer");

var ProductsView = require("./views/ProductsView.jsx");
var Layout = require("./layout/Layout");

var ReduxRouter = require("redux-router").ReduxRouter;
var routerStateReducer = require("redux-router").routerStateReducer;
var reduxReactRouter = require("redux-router").reduxReactRouter;
var pushState = require("redux-router").pushState;

var Route = require("react-router").Route;
var IndexRoute = require("react-router").IndexRoute;
var Link = require("react-router").Link;

var unsubscribe = store.subscribe(function() {
   
});

store.dispatch(ProductAC.fetchAll());
window.store = store;

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Provider store={store}>
                    <div className="content-wrapper">
                        <div className="layout-wrapper">
                            <Layout />
                        </div>
                        <div className="view-wrapper">
                            <ReduxRouter>
                                <Route path="/">
                                    <IndexRoute component={ProductsView}/>
                                </Route>
                            </ReduxRouter>
                        </div>
                    </div>
                </Provider>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    window.document.getElementById('content')
);