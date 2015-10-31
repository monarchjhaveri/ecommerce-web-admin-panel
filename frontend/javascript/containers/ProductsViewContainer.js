var connect = require("react-redux").connect;
var ProductsView = require("../views/ProductsView.jsx");

function mapStateToProps(state) {
    console.log("mapStateToProps called with", state);
    return {
        products: state.products
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ProductsView);