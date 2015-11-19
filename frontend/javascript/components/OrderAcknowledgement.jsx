var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var moment = require("moment");
var Link = require("react-router").Link;
var connect = require("react-redux").connect;
var OrderAC = require("../actions/OrderAC");
var PopoverAC = require("../actions/PopoverAC");
var Constants = require("../Constants");

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

var OrderAcknowledgement = React.createClass({ displayName: "OrderAcknowledgement",
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
    submitAcknowledgement: function() {
        var ValidationResult = this.refs.form.validate();
        var merchant_order_id = this.props.params && this.props.params.merchant_order_id;

        if (!merchant_order_id) {
            PopoverAC.displayErrorFromText("Merchant Order not selected.");
        } else if (ValidationResult.errors.length > 0) {
            PopoverAC.displayErrorFromText("Validation failed.");
            ValidationResult.errors.forEach(function(d) {
                console.log(d.message);
                PopoverAC.displayErrorFromText(d.message);
            });
        } else {
            OrderAC.acknowledge(merchant_order_id, this.refs.form.getValue());
        }
    },
    getOrderById: function(orderId) {
        return this.props.orders.get(orderId);
    },
    render: function() {
        var merchantOrderId = this.props.params.merchant_order_id;
        var selectedOrder = this.props.selectedOrder;

        if (!merchantOrderId || !selectedOrder) {
            return (
                <div className="col-xs-12">
                    No order selected!
                </div>
            );
        }

        if (!selectedOrder.status || selectedOrder.status !== Constants.ORDER_STATUS.READY) {
            return (
                <div className="col-xs-12">
                    Order status MUST be "acknowledged" in order to ship it.
                </div>
            );
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
module.exports = connect(mapStateToProps, mapDispatchToProps)(OrderAcknowledgement);