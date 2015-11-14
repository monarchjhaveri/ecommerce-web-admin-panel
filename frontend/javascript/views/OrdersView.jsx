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
filterByStatusOptions.unshift(<option key={"nullvalue"} disabled hidden value=''></option>);

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
    },
    fetchOrders: function(){
        OrderAC.fetchAll(this.props.ordersFilter.get("status"));
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps.ordersFilter);
    },
    getSelectedOrder: function() {
        var selectedOrder = this.props.router && this.props.router.params && this.props.router.params.merchant_order_id;
        return selectedOrder ? selectedOrder : null;
    },
    getOrderElements: function() {
        var orders = this.props.orders.toList();
        var className = "sidebar-select-list-item";
        var self = this;
        var ordersDOM = orders.map(function(d) {
            return (
                <div key={d.merchant_order_id} className={className}>
                     <Link to={"orders/" + d.merchant_order_id}>
                        {d.merchant_order_id}
                     </Link>
                </div>
            )
        });
        return ordersDOM;
    },
    render: function() {
        return (
            <div className="view">
                <div className="view-sidebar">
                    <div className="sidebar-list-button btn btn-small btn-info"
                        onClick={this.fetchOrders}>
                        Fetch Orders
                    </div>
                    <div className="sidebar-list-button">
                        <div className="sidebar-list-button-panel">
                            <select
                                defaultValue={null}
                                value={this.props.ordersFilter.get("state")}
                                onChange={this.handleOrdersFilterStatusChange} >
                                {filterByStatusOptions}
                            </select>
                        </div>
                    </div>
                    <div className="sidebar-select-list">
                        {this.getOrderElements()}
                    </div>
                </div>
                <div className="order-details">
                    {this.getSelectedOrder()}
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
        ordersFilter: state.ordersFilter,
        router: state.router
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ProductsView);