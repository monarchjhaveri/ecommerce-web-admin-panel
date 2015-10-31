var React = require("react");

var Product = React.createClass({ displayName: "Product",
    render: function() {
        return (
          <div>I am a product.</div>
        );
    }
});

module.exports = Product;