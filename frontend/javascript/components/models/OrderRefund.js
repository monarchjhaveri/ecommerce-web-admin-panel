var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");
var ModelsHelper = require("./ModelsHelper");
var OptionsHelper = require("./OptionsHelper");

function refundAmount(order) {
    return t.struct({
        principal: t.Number,
        tax: t.Number,
        shipping_cost: t.Number,
        shipping_tax: t.Number
    })
}

function order_refund_item(order) {
    return t.struct({
        order_item_id: t.String,
        //alt_order_item_id: t.hidden,
        total_quantity_returned: t.maybe(t.Number),
        order_return_refund_qty: t.maybe(t.Number),
        refund_reason: t.enums({
            'wrong quantity received': 'wrong quantity received',
            'received wrong item than what was ordered': 'received wrong item than what was ordered',
            'accidental order': 'accidental order',
            'item is damaged/broken': 'item is damaged/broken',
            'item is defective/does not work properly': 'item is defective/does not work properly',
            'shipping box and item are both damaged': 'shipping box and item are both damaged',
            'item was different than website description': 'item was different than website description',
            'package arrived later than promised delivery date': 'package arrived later than promised delivery date',
            'package never arrived': 'package never arrived',
            'unwanted gift': 'unwanted gift',
            'unauthorized purchase': 'unauthorized purchase',
            'better price available': 'better price available',
            'no longer need/want': 'no longer need/want'
        }),
        refund_feedback: t.maybe(t.enums({
            'other': 'Other - Please leave note below',
            'item damaged': 'Item damaged - should only be used if the reason for the return was not that it was damaged when the customer received it',
            'not shipped in original packaging': 'not shipped in original packaging',
            'customer opened item': 'customer opened item'
        })),
        notes: t.maybe(t.String),
        refund_amount: refundAmount(order)
    });
}

function _orderRefund(order) {
    return t.struct({
        items: t.list(order_refund_item(order))
    })
}

function _optionsFactory(order) {
    return OptionsHelper.applyDefaultOptions({
        fields: {
            items: {
                item: {
                    fields: {
                        order_item_id: OptionsHelper.helpRenderers.helpBoxOnly("Jet's unique identifier for an item in a merchant order."),
                        total_quantity_returned: OptionsHelper.helpRenderers.helpBoxOnly("Quanitity of the given item that was cancelled. This quantity should only include the units that were returned to the merchant. Any cancelled items should not be included if the items were cancelled before the return"),
                        order_return_refund_qty: OptionsHelper.helpRenderers.helpBoxOnly("Quanitity of the given item that the merchant wants to refund to the customer. Required to indicate the quantity of the given item to be refunded."),
                        refund_reason: OptionsHelper.helpRenderers.helpBoxOnly("The reason the customer initiated the return."),
                        refund_feedback: {
                            help: OptionsHelper.helpRenderers.helpText([
                                "Number of business days from receipt of an order for the given merchant SKU until it will be shipped (only populate if it is different than your account default).",
                                "Valid Values",
                                "'other' - please give additional information in the notes field",
                                "'item damaged' - should only be used if the reason for the return was not that it was damaged when the customer received it",
                                "'not shipped in original packaging'",
                                "customer opened item"])
                        },
                        notes: OptionsHelper.helpRenderers.helpBoxOnly("Provide additional information about why the item was refunded for lower than the full amount"),
                        refund_amount: {
                            fields: {
                                principal: OptionsHelper.helpRenderers.helpBoxOnly("Amount to be refunded for the given item in USD associated with the item itself. This should be the total cost for this item not the unit cost."),
                                tax: OptionsHelper.helpRenderers.helpBoxOnly("Amount to be refunded for the given item in USD associated with tax that was charged for the item."),
                                shipping_cost: OptionsHelper.helpRenderers.helpBoxOnly("Amount to be refunded for the given item in USD associated with the shipping cost that was allocated to this item."),
                                shipping_tax: OptionsHelper.helpRenderers.helpBoxOnly("Amount to be refunded for the given item in USD associated with the tax that was charged on shipping.")
                            }
                        }
                    }
                }
            }
        }
    });
}

function _valueFactory(order) {
    if (!order || !order.order_items) {
        return { items: [] };
    }
    return {
        items: order.order_items.map(function (d) {
            return {
                order_item_id: d.order_item_id,
                total_quantity_returned: d.request_order_quantity,
                order_return_refund_qty: d.request_order_quantity,
                refund_amount: {
                    principal: d.item_price.base_price || 0,
                    tax: d.item_price.item_tax || 0,
                    shipping_cost: d.item_price.item_shipping_cost || 0,
                    shipping_tax: d.item_price.item_shipping_tax || 0
                }
            }
        })
    }
}

module.exports.modelFactory = _orderRefund;
module.exports.optionsFactory = _optionsFactory;
module.exports.valueFactory = _valueFactory;