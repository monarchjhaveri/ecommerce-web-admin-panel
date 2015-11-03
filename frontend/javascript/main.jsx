var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require("./store/store");
var ProductAC = require("./actions/ProductAC");
var Header = require("./layout/Header");
var Footer = require("./layout/Footer");

var ProductsViewContainer = require("./containers/ProductsViewContainer");
var LoadingModalContainer = require("./containers/LoadingModalContainer");

var unsubscribe = store.subscribe(function() {
   
});

store.dispatch(ProductAC.fetchAll());
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