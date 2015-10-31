var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var App = require("./App.jsx");

function productStore() {
    return [
        {"sku": "123456"}
    ]
}

var initialState = {
    products: []
};

var store = createStore(productStore,initialState);
window.top.store = store;


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    window.document.getElementById('content')
);