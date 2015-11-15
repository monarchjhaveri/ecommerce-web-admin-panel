var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var moment = require("moment");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel").model;
var productModelOptionsFactory = require("./models/ProductModel").optionsFactory;

var OrderDetails = React.createClass({ displayName: "OrderDetails",
    order: {
        order: React.PropTypes.object
    },
    render: function() {
        var order = this.props.order;

        if (!order) {
            return null;
        }

        return (
            <div className="col-xs-12">
                <h3>Order Information</h3>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-4 well well-sm">
                            Order Placed Time: <br/>{timestampToString(order.order_placed_date)}
                        </div>
                        <div className="col-xs-4 well well-sm pull-right">
                            Order Status: <br/>
                            <span>{order.status}</span>
                        </div>
                    </div>
                    <div className="row">
                        <table className="table table-bordered table-condensed">
                            <tbody>
                            <tr>
                                <td>Merchant Order Id</td>
                                <td>{order.merchant_order_id}</td>
                            </tr>
                            <tr>
                                <td>Reference Order ID</td>
                                <td>{order.reference_order_id}</td>
                            </tr>
                            <tr>
                                <td>Alternate Order ID</td>
                                <td>{order.alt_order_id}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <h4>Order Timestamps</h4>
                        <table className="table table-bordered table-condensed">
                            <tbody>
                            <tr>
                                <td>Order Placed Date</td>
                                <td>{timestampToString(order.order_placed_date)}</td>
                            </tr>
                            <tr>
                                <td>Order Ready Date</td>
                                <td>{timestampToString(order.order_ready_date)}</td>
                            </tr>
                            <tr>
                                <td>Order Acknowledge Date</td>
                                <td>{timestampToString(order.order_acknowledge_date)}</td>
                            </tr>
                            <tr>
                                <td>Order Transmission Date</td>
                                <td>{timestampToString(order.order_transmission_date)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <h4>Customer Information</h4>
                        <table className="table table-bordered table-condensed">
                            <tbody>
                                <tr>
                                    <td>Customer Name</td>
                                    <td>{order.buyer && order.buyer.name}</td>
                                </tr>
                                <tr>
                                    <td>Customer Phone</td>
                                    <td>{order.buyer && order.buyer.phone_number}</td>
                                </tr>
                                <tr>
                                    <td>Customer Email</td>
                                    <td>{order.hash_email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <h4>Shipping To</h4>
                        <table className="table table-bordered table-condensed">
                            <tbody>
                            <tr>
                                <td>Recipient Name</td>
                                <td>{order.shipping_to && order.shipping_to.recipient && order.shipping_to.recipient.name}</td>
                            </tr>
                            <tr>
                                <td>Recipient Phone</td>
                                <td>{order.shipping_to && order.shipping_to.recipient && order.shipping_to.recipient.phone}</td>
                            </tr>
                            <tr>
                                <td>Address 1</td>
                                <td>{order.shipping_to && order.shipping_to.address && order.shipping_to.address.address1}</td>
                            </tr>
                            <tr>
                                <td>Address 2</td>
                                <td>{order.shipping_to && order.shipping_to.address && order.shipping_to.address.address2}</td>
                            </tr>
                            <tr>
                                <td>City</td>
                                <td>{order.shipping_to && order.shipping_to.address && order.shipping_to.address.city}</td>
                            </tr>
                            <tr>
                                <td>State</td>
                                <td>{order.shipping_to && order.shipping_to.address && order.shipping_to.address.state}</td>
                            </tr>
                            <tr>
                                <td>ZIP Code</td>
                                <td>{order.shipping_to && order.shipping_to.address && order.shipping_to.address.zip_code}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <h4>Raw Data</h4>
                <pre>
                    {JSON.stringify(order, null, 4)}
                </pre>
            </div>
        )
    }
});

function timestampToString(timestamp) {
    if (!timestamp) return null;
    var m = moment(timestamp);
    if (!m.isValid()) {
        return timestamp;
    } else {
        return m.format('MMM Do [\']YY, h:mm:ss a');
    }
}

module.exports = OrderDetails;