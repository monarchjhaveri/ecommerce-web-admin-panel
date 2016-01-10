var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");
var ModelsHelper = require("./ModelsHelper");
var OptionsHelper = require("./OptionsHelper");
var math = require('mathjs');

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
            'no longer need/want': 'no longer need/want',
            'better price available': 'better price available',
            'unauthorized purchase': 'unauthorized purchase',
            'package never arrived': 'package never arrived',
            'package arrived later than promised delivery date': 'package arrived later than promised delivery date',
            'item was different than website description': 'item was different than website description',
            'shipping box and item are both damaged': 'shipping box and item are both damaged',
            'item is defective/does not work properly': 'item is defective/does not work properly',
            'item is damaged/broken': 'item is damaged/broken',
            'accidental order': 'accidental order',
            'received wrong item than what was ordered': 'received wrong item than what was ordered'
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
                                "The reason this refund is less than the full amount.",
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
                    principal: multiplyOrZero(d.item_price.base_price, d.request_order_quantity),
                    tax: multiplyOrZero(d.item_price.item_tax,  d.request_order_quantity),
                    shipping_cost: multiplyOrZero(d.item_price.item_shipping_cost,  d.request_order_quantity),
                    shipping_tax: multiplyOrZero(d.item_price.item_shipping_tax,  d.request_order_quantity)
                }
            }
        })
    }
}

function multiplyOrZero(x, y) {
    if (x && y) {
        return math.multiply(x, y);
    } else {
        return 0;
    }
}

module.exports.modelFactory = _orderRefund;
module.exports.optionsFactory = _optionsFactory;
module.exports.valueFactory = _valueFactory;