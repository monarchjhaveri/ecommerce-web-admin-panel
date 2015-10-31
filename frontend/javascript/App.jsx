var React = require("react");
var ProductsView = require("./containers/ProductsView/ProductsView.jsx");

var App = React.createClass({ displayName: "App",
    render: function() {
        return (
            <ProductsView />
        )
    }
});

module.exports = App;