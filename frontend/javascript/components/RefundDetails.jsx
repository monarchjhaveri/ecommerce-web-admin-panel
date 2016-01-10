var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var store = require("../store/store");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel").model;
var productModelOptionsFactory = require("./models/ProductModel").optionsFactory;
var RefundAC = require("../actions/RefundAC");
var connect = require("react-redux").connect;

var FrontendHelper = require("../helpers/FrontendHelper");

var timestampToString = FrontendHelper.timestampToString;

function fetchRefundIfNeeded(refund_url_id) {
    var selectedRefund = store.getState().selectedRefund;
    if (selectedRefund && selectedRefund.refund_url_id === refund_url_id) {
    } else {
        RefundAC.getDetails(refund_url_id);
    }
}

var RefundDetails = React.createClass({ displayName: "RefundDetails",
    propTypes: {
        selectedRefund: React.PropTypes.object
    },
    componentWillMount: function() {
        var refund_url_id = this.props.params && this.props.params.refund_url_id;
        if (refund_url_id) {
            fetchRefundIfNeeded(refund_url_id);
        }
    },
    componentWillReceiveProps: function(nextProps){
        var merchantOrderId = nextProps.params.refund_url_id;
        if (merchantOrderId) {
            fetchRefundIfNeeded(merchantOrderId);
        }
    },
    render: function() {
        var refundItem = this.props.selectedRefund;

        if (!refundItem) {
            return <div>No Item Selected</div>;
        }

        return (
            <div className="col-xs-12">
                <h2>Refund Details</h2>
                <h3>Raw Data</h3>
                <pre>
                    {JSON.stringify(refundItem, null, 4)}
                </pre>
            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        selectedRefund: state.selectedRefund
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RefundDetails);