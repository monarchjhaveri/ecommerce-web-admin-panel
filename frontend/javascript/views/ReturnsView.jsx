var React = require("react");
var Immutable = require("immutable");

var store = require("../store/store");
var connect = require("react-redux").connect;
var Link = require("react-router").Link;

var ReturnAC= require("../actions/ReturnAC");

var ReturnsView = React.createClass({ displayName:"ReturnsView",
    propTypes: {
        inventory: React.PropTypes.object,
        products: React.PropTypes.object,
        selectedProduct: React.PropTypes.object,
        selectedPrice: React.PropTypes.object,
        productDetails: React.PropTypes.object
    },
    render: function() {
        return (
            <div className="view">
                <div className="view-sidebar">
                    <div className="sidebar-list-button btn btn-small btn-info"
                         onClick={this.fetchOrders}>
                        Fetch Returns
                    </div>
                    <div className="sidebar-list-button">
                        <div className="sidebar-list-button-panel">
                            <select
                                onChange={this.handleOrdersFilterStatusChange} >
                            </select>
                        </div>
                    </div>
                    <div className="sidebar-select-list">

                    </div>
                </div>
                <div className="view-details">
                    {this.props.children}
                </div>

            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        products: state.products,
        inventory: state.inventory,
        selectedProduct: state.selectedProduct,
        merchant: state.merchant,
        productInventory: state.productInventory,
        productPrice: state.productPrice,
        router: state.router
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ReturnsView);