var React = require("react");
var Immutable = require("immutable");

var ProductDetails = require ("./../components/ProductDetails.jsx");
var ProductSelectList = require("../components/ProductSelectList.jsx");

var store = require("../store/store");

var ProductAC = require("../actions/ProductAC");

var ProductsView = React.createClass({ displayName:"ProductsView",
    propTypes: {
        products: React.PropTypes.object,
        selectedProduct: React.PropTypes.object,
        productDetails: React.PropTypes.object
    },
    onSelectChange: function(product){
        store.dispatch(ProductAC.select(product));
    },
    submitEdit: function(product){
        store.dispatch(ProductAC.edit(product));
    },
    getSelectedProduct: function() {
        return this.props.selectedProduct ? this.props.selectedProduct : null;
    },
    render: function() {
        return (
            <div className="view products-view">
                <ProductSelectList
                    products={this.props.products}
                    selectedProduct={this.props.selectedProduct}
                    onSelectChange={this.onSelectChange}
                />
                <ProductDetails
                    product={this.props.selectedProduct}
                    submitEdit={this.submitEdit}
                />
            </div>
        )
    }
});

module.exports = ProductsView;