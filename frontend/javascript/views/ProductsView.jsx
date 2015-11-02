var React = require("react");
var Immutable = require("immutable");

var Product = require ("./../components/Product.jsx");

var ProductsView = React.createClass({
   render: function() {
       return (
           <div className="products-view">
               {_createProductsViewArray(this.props.skus)}
           </div>
       )
   }
});


function _createProductsViewArray(products) {
    console.log("_createProductsViewArray called with", products);
    if (!products) {
        return [];
    }

    return products.map(function(d) {
        console.log(d);
        return (
            <Product
                key={d.sku}
                product={d}
            />
        )
    });

}

module.exports = ProductsView;