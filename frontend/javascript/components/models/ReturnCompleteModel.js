var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

var ModelsHelper = require("./ModelsHelper");
var OptionsHelper = require("./OptionsHelper");

var helpBoxOnly = OptionsHelper.helpRenderers.helpBoxOnly;

function orderReturnRefundItem(object) {
    return t.struct({
        order_item_id: t.maybe(t.String),
        alt_order_item_id: t.maybe(t.String),
        total_quantity_returned: t.Number,
        order_return_refund_qty: t.Number,
        return_refund_feedback: t.maybe(t.String),
        notes: t.maybe(t.String),
        refund_amount: t.struct({
            principal: t.Number,
            tax: t.Number,
            shipping_cost: t.Number,
            shipping_tax: t.Number
        })
    });
}

function modelFactory(object){
    return t.struct({
        merchant_order_id: t.maybe(t.String),
        alt_order_id: t.maybe(t.String),
        items: t.maybe(t.list(orderReturnRefundItem(object)))
    });
}

function optionsFactory(object){
    var o = {
        fields: {
            merchant_order_id: {
                help: "Test"
            },
            items: {
                item: {
                    fields: {
                        order_item_id: {
                            help: "Test"
                        }
                    }
                }
            }
        }
    };
    return o;
    return OptionsHelper.applyDefaultOptions({
        fields: {
            merchant_order_id: helpBoxOnly("Jet's unique ID for a given merchant order"),
            alt_order_id: helpBoxOnly("Optional merchant supplied order ID"),
            items: {
                item: {
                    fields: {
                        order_item_id: helpBoxOnly("Jet's unique identifier for an item in a merchant order")
                    }
                }
            },
            order_item_id: helpBoxOnly("Jet's unique identifier for an item in a merchant order"),
            alt_order_item_id: helpBoxOnly("Required if returning/refunding an item. If an alt_order_item_id has been associated with the order_item_id via the order accept message, this may be passed instead of the order_item_id field"),
            total_quantity_returned: helpBoxOnly("Quantity of the given item that was returned. Logic: Required to indicate the total quantity of units returned for the order item. This quantity should only include the units that were returned. Any cancelled items should not be included if the items were cancelled before the return"),
            order_return_refund_qty: helpBoxOnly("Quantity of the given item that was refunded. Logic: Required to indicate the quantity of the given item to be refunded to the customer."),
            return_refund_feedback: helpBoxOnly("The reason this refund is less than the full amount. \
            Valid Values: \
                'other' - please give additional information in the notes field\
                'item damaged' - should only be used if the reason for the return was not that it was damaged when the customer received it\
                'not shipped in original packaging'\
                    'customer opened item'"
            ),
            notes: helpBoxOnly("Provide additional information about why the item was refunded for lower than the full amount"),
            //refund_amount: {
            //    fields: {
            //        principal: helpBoxOnly("Amount to be refunded for the given item in USD associated with the item itself. This should be the total cost for this item not the unit cost"),
            //        tax: helpBoxOnly("Amount to be refunded for the given item in USD associated with tax that was charged for the item"),
            //        shipping_cost: helpBoxOnly("Amount to be refunded for the given item in USD associated with the shipping cost that was allocated to this item"),
            //        shipping_tax: helpBoxOnly("Amount to be refunded for the given item in USD associated with the tax that was charged on shipping")
            //    }
            //}
        }
    });
}

module.exports.modelFactory = modelFactory;
module.exports.optionsFactory = optionsFactory;