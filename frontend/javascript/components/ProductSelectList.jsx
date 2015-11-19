var React = require("react");
var ProductAC= require("../actions/ProductAC");

var ProductSelectList = React.createClass({ displayName: "ProductSelectList",
    propTypes: {
        products: React.PropTypes.object.isRequired,
        selectedProduct: React.PropTypes.object,
        onSelectChange: React.PropTypes.func.isRequired,
        createAction: React.PropTypes.func
    },
    render: function() {
        return (
            <div className="view-sidebar">
                <div className="sidebar-list-button btn btn-small btn-info"
                     onClick={ProductAC.fetchAll}>
                    Fetch Products
                </div>
                <div className="sidebar-select-list">
                    {_createProductsArray(this.props.products, this.props.selectedProduct, this.props.onSelectChange)}
                </div>
                <div className="sidebar-list-button btn btn-small btn-success"
                    onClick={ProductAC.openEditorToCreate}>
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

    return products.toList().map(function(d) {
        var className = "sidebar-select-list-item";
        className = selectedProduct && selectedProduct.merchant_sku === d.merchant_sku ? className + " selected" : className;
        var key = d.merchant_sku + ":" + d.product_title;
        return (
            <div key={key}
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