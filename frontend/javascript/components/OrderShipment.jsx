var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var moment = require("moment");
var Link = require("react-router").Link;
var connect = require("react-redux").connect;
var OrderAC = require("../actions/OrderAC");
var Constants = require("../Constants");

var t = require('tcomb-form');
var Form = t.form.Form;
var OrderShipmentModelFactory = require("./models/OrderShipment").modelFactory;
var OrderShipmentOptionsFactory = require("./models/OrderShipment").optionsFactory;

function fetchOrderIfNeeded(merchantOrderId) {
    var selectedOrder = store.getState().selectedOrder;
    if (selectedOrder && selectedOrder.merchant_order_id === merchantOrderId) {

    } else {
        OrderAC.getDetails(merchantOrderId);
    }
}

var OrderShipment = React.createClass({ displayName: "OrderShipment",
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
        var value = this.refs.form.getValue();
        var merchant_order_id = this.props.params && this.props.params.merchant_order_id;

        // getValue returns null if validation failed
        if (!value || !merchant_order_id) {
            return;
        }

        OrderAC.ship(merchant_order_id, this.refs.form.getValue());
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

        if (!selectedOrder.status || selectedOrder.status !== Constants.ORDER_STATUS.ACKNOWLEDGED) {
            return (
                <div className="col-xs-12">
                    Order status MUST be "acknowledged" in order to ship it.
                </div>
            );
        }

        var link = "orders/" + this.props.params.merchant_order_id;
        return (
            <div className="col-xs-12">
                <h3>Shipment</h3>
                <Form
                    type={OrderShipmentModelFactory(this.props.selectedOrder)}
                    options={OrderShipmentOptionsFactory(this.props.selectedOrder)}
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
module.exports = connect(mapStateToProps, mapDispatchToProps)(OrderShipment);