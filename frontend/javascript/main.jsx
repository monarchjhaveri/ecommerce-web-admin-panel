var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;

var store = require("./store/store");
var ProductAC = require("./actions/ProductAC");

var App = require("./App.jsx");

console.log("initial state", store.getState());

var unsubscribe = store.subscribe(function() {
   console.log(store.getState());
});

store.dispatch(ProductAC.fetchAll());
window.store = store;


//
//ReactDOM.render(
//    <Provider store={store}>
//        <App />
//    </Provider>,
//    window.document.getElementById('content')
//);