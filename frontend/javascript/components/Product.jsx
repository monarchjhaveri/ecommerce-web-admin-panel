var React = require("react");

var Product = React.createClass({ displayName: "Product",
    render: function() {
        return (
          <div className="product">
              <div className="sku">SKU: {this.props.product.sku}</div>
          </div>
        );
    }
});

module.exports = Product;