var React = require("react");
var Immutable = require("immutable");

var ProductDetails = require ("./../components/ProductDetails.jsx");
var ProductSelectList = require("../components/ProductSelectList.jsx");

var store = require("../store/store");
var connect = require("react-redux").connect;
var Link = require("react-router").Link;

var OrderAC = require("../actions/OrderAC");

var ProductsView = React.createClass({ displayName:"OrdersView",
    propTypes: {
        orders: React.PropTypes.object,
        selectedOrder: React.PropTypes.object,
        orderDetails: React.PropTypes.object
    },
    onSelectChange: function(product){
        store.dispatch(OrderAC.getDetails(product));
    },
    submitEdit: function(product){
        if (product._id) {
            store.dispatch(OrderAC.edit(product));
        } else {
            store.dispatch(OrderAC.create(product));
        }
    },
    onDelete: function(product) {
        store.dispatch(OrderAC.delete(product));
    },
    getSelectedProduct: function() {
        return this.props.selectedProduct ? this.props.selectedProduct : null;
    },
    createAction: function() {
        store.dispatch(OrderAC.openEditorToCreate());
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

function mapStateToProps(state) {
    return {
        products: state.products,
        selectedProduct: state.selectedProduct
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ProductsView);