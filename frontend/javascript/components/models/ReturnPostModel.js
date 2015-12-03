var React = require('react');
var t = require('tcomb-form');;
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

var ModelsHelper = require("./ModelsHelper");

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
    return ModelsHelper.applyDefaultOptions({

    });
}

module.exports.modelFactory = modelFactory;
module.exports.optionsFactory = optionsFactory;