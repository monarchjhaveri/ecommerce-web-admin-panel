var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require("./store/store");
var ProductAC = require("./actions/ProductAC");

var ProductsView = require("./views/ProductsView.jsx");
var Modals = require("./modals/Modals.jsx");

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
                            <nav className="navbar navbar-default navbar-fixed-top">
                                <div className="container-fluid">
                                    <div className="navbar-header">
                                        <a href="#" className="navbar-brand">Admin Panel</a>
                                    </div>
                                    <div id="navbar" className="navbar-collapse collapse">
                                        <ul className="nav navbar-nav">
                                            <li className="active"><a href="#">Home</a></li>
                                            <li><a href="#about">About</a></li>
                                            <li><a href="#contact">Contact</a></li>
                                            <li className="dropdown">
                                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                                                <ul className="dropdown-menu">
                                                    <li><a href="#">Action</a></li>
                                                    <li><a href="#">Another action</a></li>
                                                    <li><a href="#">Something else here</a></li>
                                                    <li role="separator" className="divider"></li>
                                                    <li className="dropdown-header">Nav header</li>
                                                    <li><a href="#">Separated link</a></li>
                                                    <li><a href="#">One more separated link</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </nav>
                            <div className="navbar navbar-default navbar-fixed-bottom">
                                <div className="container">

                                </div>
                            </div>
                            <Modals />
                        </div>
                        <div className="view-wrapper">
                            <ReduxRouter>
                                <Route path="/" component={ProductsView}>

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