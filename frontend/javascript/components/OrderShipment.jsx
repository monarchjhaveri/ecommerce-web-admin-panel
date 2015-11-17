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
var OrderShipmentModelFactory = require("./models/OrderShipment").modelFactory;

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
    render: function() {
        var merchantOrderId = this.props.params.merchant_order_id;

        if (!merchantOrderId) {
            return null;
        }

        var link = "orders/" + this.props.params.merchant_order_id;
        return (
            <div className="col-xs-12">
                <h3>Shipment</h3>
                <Form
                    type={OrderShipmentModelFactory(this.props.selectedOrder)}
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