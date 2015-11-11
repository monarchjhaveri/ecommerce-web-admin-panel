var React = require("react");
var Immutable = require("immutable");

var ProductDetails = require ("./../components/ProductDetails.jsx");
var ProductSelectList = require("../components/ProductSelectList.jsx");

var Constants = require("../Constants");
var store = require("../store/store");
var connect = require("react-redux").connect;
var Link = require("react-router").Link;

var OrderAC = require("../actions/OrderAC");

var filterByStatusOptions = [
    {value: Constants.ORDER_STATUS.ACKNOWLEDGED, label: "Acknowledged"},
    {value: Constants.ORDER_STATUS.COMPLETE, label: "Complete"},
    {value: Constants.ORDER_STATUS.CREATED, label: "Created"},
    {value: Constants.ORDER_STATUS.IN_PROGRESS, label: "In Progress"},
    {value: Constants.ORDER_STATUS.READY, label: "Ready"}
].map(function(d) {
    return <option value={d.value} key={d.value}>{d.label}</option>
});
filterByStatusOptions.unshift(<option key={"nullvalue"} selected disabled hidden value=''></option>);

var ProductsView = React.createClass({ displayName:"OrdersView",
    propTypes: {
        orders: React.PropTypes.object,
        selectedOrder: React.PropTypes.object,
        orderDetails: React.PropTypes.object,
        ordersFilter: React.PropTypes.object
    },
    handleOrdersFilterStatusChange: function(ev) {
        var newValue = ev.target.value;
        OrderAC.setFilter(newValue);
        OrderAC.fetchAll(newValue);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps.ordersFilter);
    },
    render: function() {
        return (
            <div className="view products-view">
                <div className="navbar navbar-top">
                    <div className="well well-sm">
                        <label >
                            Filter By Status:
                            <select
                                value={this.props.ordersFilter.get("state")}
                                onChange={this.handleOrdersFilterStatusChange} >
                                {filterByStatusOptions}
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        )
    }
});

function mapStateToProps(state) {
    return {
        products: state.products,
        selectedProduct: state.selectedProduct,
        orders: state.orders,
        selectedOrder: state.selectedOrder,
        orderDetails: state.orderDetails,
        ordersFilter: state.ordersFilter
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ProductsView);