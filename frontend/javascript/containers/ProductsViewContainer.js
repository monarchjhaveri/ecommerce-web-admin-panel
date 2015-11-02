var connect = require("react-redux").connect;
var ProductsView = require("../views/ProductsView.jsx");

function mapStateToProps(state) {
    return {
        productDetails: state.productDetails,
        skus: state.skus,
        selectedSku: state.selectedSku
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProductsView);