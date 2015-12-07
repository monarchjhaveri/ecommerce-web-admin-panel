var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

var ModelsHelper = require("./ModelsHelper");
var OptionsHelper = require("./OptionsHelper");

var helpBoxOnly = OptionsHelper.helpRenderers.helpBoxOnly;

function orderReturnRefundItem(object) {
    return t.struct({
        order_item_id: t.maybe(t.String),
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
        merchant_order_id: t.String,
        items: t.maybe(t.list(orderReturnRefundItem(object))),
        agree_to_return_charge: t.Boolean,
        return_charge_feedback: t.maybe(t.String)
    });
};

function optionsFactory(object){
    return OptionsHelper.applyDefaultOptions({
        order: ['merchant_order_id', 'items', 'agree_to_return_charge', 'return_charge_feedback'],
        fields: {
            merchant_order_id: {
                help: OptionsHelper.helpRenderers.helpText("Jet's unique ID for a given merchant order"),
                factory: t.form.Select,
                options: [
                    {value: object.merchant_order_id, text: object.merchant_order_id}
                ]
            },
            items: {
                item: {
                    order: [
                        'order_item_id',
                        'refund_amount',
                        'total_quantity_returned',
                        'order_return_refund_qty',
                        'notes',
                        'return_refund_feedback'
                    ],
                    fields: {
                        order_item_id: {
                            help: OptionsHelper.helpRenderers.helpText("Jet's unique identifier for an item in a merchant order"),
                            factory: t.form.Select,
                            options: object.return_merchant_SKUs && object.return_merchant_SKUs instanceof Array ?
                                object.return_merchant_SKUs.map(function(d) {
                                    return {value: d.order_item_id, text: d.order_item_id}
                                }) :
                                []
                        },
                        total_quantity_returned: helpBoxOnly("Quantity of the given item that was returned. Logic: Required to indicate the total quantity of units returned for the order item. This quantity should only include the units that were returned. Any cancelled items should not be included if the items were cancelled before the return"),
                        order_return_refund_qty: helpBoxOnly("Quantity of the given item that was refunded. Logic: Required to indicate the quantity of the given item to be refunded to the customer."),
                        return_refund_feedback: helpBoxOnly(
                            "The reason this refund is less than the full amount. \
                            Valid Values: \
                                'other' - please give additional information in the notes field\
                                'item damaged' - should only be used if the reason for the return was not that it was damaged when the customer received it\
                                'not shipped in original packaging'\
                                'customer opened item'"
                        ),
                        notes: helpBoxOnly("Provide additional information about why the item was refunded for lower than the full amount"),
                        refund_amount: {
                            fields: {
                                principal: helpBoxOnly("Amount to be refunded for the given item in USD associated with the item itself. This should be the total cost for this item not the unit cost"),
                                tax: helpBoxOnly("Amount to be refunded for the given item in USD associated with tax that was charged for the item"),
                                shipping_cost: helpBoxOnly("Amount to be refunded for the given item in USD associated with the shipping cost that was allocated to this item"),
                                shipping_tax: helpBoxOnly("Amount to be refunded for the given item in USD associated with the tax that was charged on shipping")
                            }
                        }
                    }
                }
            },
            agree_to_return_charge: {
                help: OptionsHelper.helpRenderers.helpText("Does the merchant agree to the return charge for the return notification?"),
                factory: t.form.Radio,
                options: [
                    {value: 'true', text: "Yes - The merchant agrees to wholly pay the return charge to Jet.com from the return notification"},
                    {value: 'false', text: "No - The merchant disagrees with the return charge and will enter a disputed charge with Jet.com"}
                ],
                transformer: {
                    format: function(value){
                        return value;
                    },
                    parse: function(value) {
                        switch (value) {
                            case "true":
                                return true;
                                break;
                            case "false":
                                return false;
                                break;
                            default:
                                return null;
                                break;
                        }
                    }
                }
            },
            return_charge_feedback: {
                help: OptionsHelper.helpRenderers.helpText([
                    "The reason the merchant does not agree to the return charge for the return notification",
                    "Valid Values:",
                    "'Other' - Please give additional information in the notes field",
                    "'Outside Merchant Policy' - The merchant disagrees that paying for this return charge mirrors their existing policy. This should only apply to returns for correct, non-damaged, non-defective items.",
                    "'Not Merchant Error' - The merchant disagrees that it was their (or their agent's) error that caused this return"
                ]),
                factory: t.form.Select,
                options: [
                    {value: 'other', text: "Other"},
                    {value: 'outsideMerchantPolicy', text: "Outside Merchant Policy"},
                    {value: 'notMerchantError', text: "Not Merchant Error"}
                ]
            }
        }
    });
}

module.exports.modelFactory = modelFactory;
module.exports.optionsFactory = optionsFactory;