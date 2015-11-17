var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var moment = require("moment");
var Link = require("react-router").Link;
var connect = require("react-redux").connect;
var OrderAC = require("../actions/OrderAC");

var t = require('tcomb-form');
var Form = t.form.Form;
var OrderAcknowledgementModelFactory = require("./models/OrderAcknowledgement").modelFactory;

function fetchOrderIfNeeded(merchantOrderId) {
    var selectedOrder = store.getState().selectedOrder;
    if (selectedOrder && selectedOrder.merchant_order_id === merchantOrderId) {

    } else {
        OrderAC.getDetails(merchantOrderId);
    }
}

var OrderDetails = React.createClass({ displayName: "OrderDetails",
    order: {
        order: React.PropTypes.object
    },
    componentWillMount: function() {
        var merchantOrderId = this.props.params && this.props.params.merchant_order_id;
        if (merchantOrderId) {
            fetchOrderIfNeeded(merchantOrderId);
        }
    },
    componentWillReceiveProps: function(nextProps){
        var merchantOrderId = nextProps.params.merchant_order_id;
        if (merchantOrderId) {
            fetchOrderIfNeeded(merchantOrderId);
        }
    },
    getOrderById: function(orderId) {
        return this.props.orders.get(orderId);
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
    render: function() {
        var merchantOrderId = this.props.params.merchant_order_id;

        if (!merchantOrderId) {
            return null;
        }

        var link = "orders/" + this.props.params.merchant_order_id;
        return (
            <div className="col-xs-12">
                <h3>Acknowledgement</h3>
                <Form
                    type={OrderAcknowledgementModelFactory(this.props.selectedOrder)}
                    ref="form"
                    />
                <Link className="btn btn-warning" to={link}>
                    Cancel
                </Link>
                <div className="btn btn-success" onClick={this.submitAcknowledgement}>Submit</div>
            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        selectedOrder: state.selectedOrder
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(OrderDetails);