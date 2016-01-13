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
var ModelsHelper = require("./models/ModelsHelper");

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
            var result = JSON.parse(JSON.stringify(this.refs.form.getValue()));

            result.shipments = result.shipments.map(function(d) {
                d.response_shipment_date = ModelsHelper.dateToJetDate(d.response_shipment_date);
                d.expected_delivery_date = ModelsHelper.dateToJetDate(d.expected_delivery_date);
                d.carrier_pick_up_date = ModelsHelper.dateToJetDate(d.carrier_pick_up_date);
                return d;
            });

            OrderAC.ship(merchant_order_id, result);
        }
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

        if (!selectedOrder.status || !(selectedOrder.status === Constants.ORDER_STATUS.ACKNOWLEDGED || selectedOrder.status === Constants.ORDER_STATUS.IN_PROGRESS)) {
            return (
                <div className="col-xs-12">
                    Order status MUST be "acknowledged" or "in progress" in order to ship it.
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