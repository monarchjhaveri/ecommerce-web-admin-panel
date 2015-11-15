var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

var OrderShipment = t.struct({
    merchant_sku: t.String,
    alt_shipment_item_id: t.maybe(t.String)
});

var OrderAcknowledgementItem = t.struct({
    order_item_id: t.String,
    order_item_acknowledgement_status: t.enums({
        "nonfulfillable": "nonfulfillable",
        "nonfulfillable - no inventory" : "nonfulfillable - no inventory",
        "fulfillable": "fulfillable"
    }),
    alt_order_item_id: t.maybe(t.String)
});

var OrderAcknowledgement = t.struct({
    acknowledgement_status: t.enums({
        "rejected - item level error": "rejected - item level error",
        "rejected - ship from location not available": "rejected - ship from location not available",
        "rejected - shipping method not supported": "rejected - shipping method not supported",
        "rejected - unfulfillable address" : "rejected - unfulfillable address",
        "accepted" : "accepted"
    }),
    alt_order_id: t.maybe(t.String),
    order_items: t.list(OrderAcknowledgementItem),
    shipments: t.maybe(t.list(OrderShipment))
});

module.exports = OrderAcknowledgement;