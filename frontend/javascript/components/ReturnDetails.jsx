var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var store = require("../store/store");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel").model;
var productModelOptionsFactory = require("./models/ProductModel").optionsFactory;
var ReturnAC = require("../actions/ReturnAC");
var connect = require("react-redux").connect;

var FrontendHelper = require("../helpers/FrontendHelper");

var timestampToString = FrontendHelper.timestampToString;

function fetchReturnIfNeeded(return_url_id) {
    var selectedReturn = store.getState().selectedReturn;
    if (selectedReturn && selectedReturn.return_url_id === return_url_id) {
    } else {
        ReturnAC.getDetails(return_url_id);
    }
}

var ReturnDetails = React.createClass({ displayName: "ReturnDetails",
    propTypes: {
        selectedReturn: React.PropTypes.object
    },
    componentWillMount: function() {
        var return_url_id = this.props.params && this.props.params.return_url_id;
        if (return_url_id) {
            fetchReturnIfNeeded(return_url_id);
        }
    },
    componentWillReceiveProps: function(nextProps){
        var merchantOrderId = nextProps.params.return_url_id;
        if (merchantOrderId) {
            fetchReturnIfNeeded(merchantOrderId);
        }
    },
    render: function() {
        var returnItem = this.props.selectedReturn;

        if (!returnItem) {
            return <div>No Item Selected</div>;
        }

        return (
            <div className="col-xs-12">
                <h2>Return Details</h2>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-4 well well-sm">
                            Return Time: <br/>{timestampToString(returnItem.return_date)}
                        </div>
                        <div className="col-xs-4 well well-sm pull-right">
                            Return Status: <br/>
                            <span>{returnItem.return_status}</span>
                        </div>
                    </div>
                    <div className="row">
                        <h3>Return Information</h3>
                        <div className="row">
                            <table className="table table-bordered table-condensed">
                                <tbody>
                                <tr>
                                    <td>Merchant Return Authorization ID</td>
                                    <td>{returnItem.merchant_return_authorization_id}</td>
                                </tr>
                                <tr>
                                    <td>Reference Return Authorization ID</td>
                                    <td>{returnItem.reference_return_authorization_id}</td>
                                </tr>
                                <tr>
                                    <td>Refund Without Return?</td>
                                    <td>{returnItem.refund_without_return ? "Yes" : "No"}</td>
                                </tr>
                                <tr>
                                    <td>Merchant Return Charge</td>
                                    <td>${returnItem.merchant_return_charge}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <h3>Order Details</h3>
                        <div className="row">
                            <table className="table table-bordered table-condensed">
                                <tbody>
                                <tr>
                                    <td>Merchant Order ID</td>
                                    <td>{returnItem.merchant_order_id}</td>
                                </tr>
                                <tr>
                                    <td>Return Order ID</td>
                                    <td>{returnItem.reference_order_id}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr/>
                        <h3>Returned Items</h3>
                        <div className="row">
                            {_getReturnedItems(returnItem.return_merchant_SKUs)}
                        </div>
                        <hr/>
                        <h3>Shipping Details</h3>
                        <div className="row">
                            <table className="table table-bordered table-condensed">
                                <tbody>
                                <tr>
                                    <td>Shipping Carrier</td>
                                    <td>{returnItem.shipping_carrier}</td>
                                </tr>
                                <tr>
                                    <td>Tracking Number</td>
                                    <td>{returnItem.tracking_number}</td>
                                </tr>
                                <tr>
                                    <td>Return Url ID</td>
                                    <td>{returnItem.return_url_id}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <h3>Raw Data</h3>
                <pre>
                    {JSON.stringify(returnItem, null, 4)}
                </pre>
            </div>
        );
    }
});

function _getReturnedItems(return_merchant_SKUs) {
    var map = return_merchant_SKUs && return_merchant_SKUs.map(function(d){
        return (
            <div className="card" key={d.merchant_sku}>
                <div className="card-block">
                    <table className="table table-bordered table-condensed">
                        <tbody>
                            <tr>
                                <td>Order Item ID</td>
                                <td>{d.order_item_id}</td>
                            </tr>
                            <tr>
                                <td>Merchant SKU</td>
                                <td>{d.merchant_sku}</td>
                            </tr>
                            <tr>
                                <td>Product Description</td>
                                <td>{d.merchant_sku_title}</td>
                            </tr>
                            <tr>
                                <td>Return Quantity</td>
                                <td>{d.return_quantity}</td>
                            </tr>
                            <tr>
                                <td>Return Reason</td>
                                <td>{d.reason}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h5>Requested Refund Amount</h5>
                    <table className="table table-bordered table-condensed">
                        <tbody>
                            <tr>
                                <td>Requested Refund Amount</td>
                                <td>{d.requested_refund_amount && d.requested_refund_amount.principal}</td>
                            </tr>
                            <tr>
                                <td>Requested Refund Amount - Tax</td>
                                <td>{d.requested_refund_amount && d.requested_refund_amount.tax}</td>
                            </tr>
                            <tr>
                                <td>Shipping Cost</td>
                                <td>{d.requested_refund_amount && d.requested_refund_amount.shipping_cost}</td>
                            </tr>
                            <tr>
                                <td>Shipping Tax</td>
                                <td>{d.requested_refund_amount && d.requested_refund_amount.shipping_tax}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    });
    return (
        <div className="card-group">
            {map}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        selectedReturn: state.selectedReturn
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ReturnDetails);