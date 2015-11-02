var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require("./store/store");
var SkusAC = require("./actions/SkusAC");
var Header = require("./layout/Header");
var Footer = require("./layout/Footer");

var ProductsViewContainer = require("./containers/ProductsViewContainer");
var LoadingModalContainer = require("./containers/LoadingModalContainer");

console.log("initial state", store.getState());

var unsubscribe = store.subscribe(function() {
   console.log(store.getState());
});

store.dispatch(SkusAC.fetchAll());
window.store = store;



ReactDOM.render(
    <Provider store={store}>
        <div className="content-wrapper">
            <Header />
            <div className="view-wrapper">
                <ProductsViewContainer />
            </div>
            <Footer />
            <LoadingModalContainer />
        </div>
    </Provider>,
    window.document.getElementById('content')
);