var React = require("react");
var Immutable = require("immutable");

var OrderDetails = require ("./../components/OrderDetails.jsx");

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
    {value: Constants.ORDER_STATUS.READY, label: "Ready"},
    {value: Constants.ORDER_STATUS.DIRECTED_CANCEL, label: "Directed Cancel"}
].map(function(d) {
    return <option value={d.value} key={d.value}>{d.label}</option>
});
filterByStatusOptions.unshift(<option key={"nullvalue"} disabled hidden value=''></option>);

var ProductsView = React.createClass({ displayName:"getSelectedOrder",
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
    getOrderById: function(orderId) {
        return this.props.orders.get(orderId);
    },
    getSelectedOrderId: function() {
        var selectedOrder = this.props.router && this.props.router.params && this.props.router.params.merchant_order_id;
        return selectedOrder ? selectedOrder : null;
    },
    getSelectedOrder: function() {
        var selectedOrderId = this.getSelectedOrderId();
        if (!selectedOrderId) {
            return null;
        }
        var selectedOrder = this.getOrderById(selectedOrderId);
        if (!selectedOrder) {
            return null;
        }
        return selectedOrder;
    },
    getRightViewColumn: function() {
        if (!this.getSelectedOrderId()) {
            return null;
        }

        var links = [];

        var orderStatus = this.getSelectedOrder() && this.getSelectedOrder().status;

        if (orderStatus === Constants.ORDER_STATUS.READY) {
            links.push(_createLinkButton("orders/" + this.getSelectedOrderId() + "/acknowledge", "Acknowledge"));
        } else if (orderStatus === Constants.ORDER_STATUS.ACKNOWLEDGED) {
            links.push(_createLinkButton("orders/" + this.getSelectedOrderId() + "/shipment", "Shipped"));
        } else if (orderStatus === Constants.ORDER_STATUS.IN_PROGRESS || orderStatus === Constants.ORDER_STATUS.COMPLETE) {
            var linkText = "/packingslip.html?merchant_order_id=" + this.getSelectedOrderId();
            var label = "Packing Slip";
            links.push(
                <a className="btn btn-default" href={linkText} key={label+linkText} target="_blank">
                    {label}
                </a>
            );
        }

        return (
            <div className="view-right-column">
                <h3>Options</h3>
                {links}
            </div>
        )
    },
    getOrderElements: function() {
        var orders = this.props.orders.toList();
        var className = "sidebar-select-list-item";
        var selectedOrderId = this.getSelectedOrderId();
        var ordersDOM = orders.map(function(d) {
            var thisClassName = selectedOrderId && d.merchant_order_id === selectedOrderId ?
                className + " selected" :
                className;
            return (
                <div key={d.merchant_order_id} className={thisClassName}>
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
                <div className="view-details">
                    {this.props.children}
                </div>
                {this.getRightViewColumn()}
            </div>
        )
    }
});

function _createLinkButton(link, label) {
    return (
        <Link className="btn btn-default" to={link} key={label+link}>
            {label}
        </Link>
    );
}

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