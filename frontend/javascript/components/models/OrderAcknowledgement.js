var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");
var ModelsHelper = require("./ModelsHelper");

function _orderShipment(order) {
    return t.struct({
        merchant_sku: t.String,
        alt_shipment_item_id: t.maybe(t.String)
    });
}

function _orderAcknowledgementItem(order) {
    var enums = ModelsHelper.getEnumsOfOrderItemsToProductTitles(order);

    return t.struct({
        //order_item_id: t.String,
        order_item_id: t.enums(enums),
        order_item_acknowledgement_status: t.enums({
            "nonfulfillable - invalid merchant SKU": "nonfulfillable - invalid merchant SKU",
            "nonfulfillable - no inventory" : "nonfulfillable - no inventory",
            "fulfillable": "fulfillable"
        })
        //alt_order_item_id: t.maybe(t.String)
    });
}

function _orderAcknowledgement(order) {
    return t.struct({
        acknowledgement_status: t.enums({
            "rejected - item level error": "rejected - item level error",
            "rejected - ship from location not available": "rejected - ship from location not available",
            "rejected - shipping method not supported": "rejected - shipping method not supported",
            "rejected - unfulfillable address" : "rejected - unfulfillable address",
            "accepted" : "accepted"
        }),
        order_items: t.list(_orderAcknowledgementItem(order)),
        //alt_order_id: t.maybe(t.String),
        //shipments: t.maybe(t.list(OrderShipment))
    });
}




module.exports.modelFactory = _orderAcknowledgement;