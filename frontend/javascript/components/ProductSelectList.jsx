var React = require("react");

var ProductSelectList = React.createClass({ displayName: "ProductSelectList",
    propTypes: {
        products: React.PropTypes.object.isRequired,
        selectedProduct: React.PropTypes.object,
        onSelectChange: React.PropTypes.func.isRequired,
        createAction: React.PropTypes.func
    },
    render: function() {
        return (
            <div className="product-view-sidebar">
                <div className="product-select-list">
                    {_createProductsArray(this.props.products, this.props.selectedProduct, this.props.onSelectChange)}
                </div>
                <div className="new-product-button btn btn-small btn-success"
                    onClick={this.props.createAction}>
                    New
                </div>
            </div>
        );
    }
});


function _createProductsArray(products, selectedProduct, onSelectChange) {
    if (!products) {
        return [];
    }

    return products.map(function(d) {
        var className = "product-select-list-item";
        className = selectedProduct && selectedProduct.merchant_sku === d.merchant_sku ? className + " selected" : className;
        return (
            <div key={d.merchant_sku}
                 className={className}
                 onClick={onSelectProductFunctionBuilder(d, onSelectChange)}>
                {d.product_title}
            </div>
        )
    });
}

function onSelectProductFunctionBuilder(product, callback) {
    return function() {
        callback(product);
    }
}

module.exports = ProductSelectList;