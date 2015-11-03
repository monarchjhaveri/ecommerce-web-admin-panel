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
        if (product._id) {
            store.dispatch(ProductAC.edit(product));
        } else {
            store.dispatch(ProductAC.create(product));
        }
    },
    onDelete: function(product) {
        store.dispatch(ProductAC.delete(product));
    },
    getSelectedProduct: function() {
        return this.props.selectedProduct ? this.props.selectedProduct : null;
    },
    createAction: function() {
        store.dispatch(ProductAC.openEditorToCreate());
    },
    render: function() {
        return (
            <div className="view products-view">
                <ProductSelectList
                    products={this.props.products}
                    selectedProduct={this.props.selectedProduct}
                    onSelectChange={this.onSelectChange}
                    createAction={this.createAction}
                />
                <ProductDetails
                    product={this.props.selectedProduct}
                    submitEdit={this.submitEdit}
                    onDelete={this.onDelete}
                />
            </div>
        )
    }
});

//<ProductEditor
//    product={{}}
//    cancelEdit={this.cancelEdit}
//    submitEdit={this.submitEdit}
//    />;

module.exports = ProductsView;