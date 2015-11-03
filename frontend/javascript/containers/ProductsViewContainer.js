var connect = require("react-redux").connect;
var ProductsView = require("../views/ProductsView.jsx");

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