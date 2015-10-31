var React = require('react');
var ReactDOM = require('react-dom');
var createStore = require('redux').createStore;
var $ = require('jquery');

function getProducts() {
    return [
        {"sku": "123456"}
        ]
}

var initialState = {
    products: []
};

var store = createStore(getProducts,initialState);
window.top.store = store;

// tutorial1.js
var CommentBox = React.createClass({
    render: function() {
        return (
            <div className="commentBox">

            </div>
        );
    }
});

ReactDOM.render(
<CommentBox />,
    window.document.getElementById('content')
);