var React = require("react");
var Immutable = require("immutable");

var ProductDetails = require ("./../components/ProductDetails.jsx");
var SkuSelectList = require("../components/SkuSelectList.jsx");

var store = require("../store/store");

var SkusAC = require("../actions/SkusAC");

var ProductsView = React.createClass({ displayName:"ProductsView",
    onSelectChange: function(sku){
        store.dispatch(SkusAC.select(sku));
        store.dispatch(SkusAC.getDetails(sku));
    },
    getSelectedProduct: function() {
        if (this.props.productDetails && this.props.selectedSku) {
            var p = this.props.productDetails.get(this.props.selectedSku);
            return p ? p : null;
        }
    },
    render: function() {
        return (
            <div className="view products-view">
                <SkuSelectList
                    skus={this.props.skus}
                    selectedSku={this.props.selectedSku}
                    onSelectChange={this.onSelectChange}
                />
                <ProductDetails
                    product={this.getSelectedProduct()}
                />
            </div>
        )
    }
});

module.exports = ProductsView;