var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");
var ModelsHelper = require("./ModelsHelper");

function return_location(order) {
    return t.struct({
        address1: t.String,
        address2: t.maybe(t.String),
        city: t.String,
        state: t.String,
        zip_code: t.String
    })
}

function order_shipment_item(order) {
    var orderEnums = ModelsHelper.getEnumsOfOrderItemsToProductTitles(order);
    return t.struct({
        shipment_item_id: t.maybe(t.String),
        alt_shipment_item_id: t.maybe(t.String),
        merchant_sku: t.enums(orderEnums),
        return_location: t.maybe(t.list(return_location(order))),
        response_shipment_sku_quantity: t.maybe(t.Number),
        response_shipment_cancel_qty: t.maybe(t.Number),
        RMA_number: t.maybe(t.String),
        days_to_return: t.maybe(t.Number)
    });
}

function order_shipped_shipment(order) {
    return t.struct({
        shipment_id: t.maybe(t.String),
        alt_shipment_id: t.maybe(t.String),
        shipment_tracking_number: t.maybe(t.String),
        shipment_items: t.maybe(t.list(order_shipment_item(order))),
        response_shipment_date: t.maybe(t.Date),
        response_shipment_method: t.maybe(t.String),
        expected_delivery_date: t.maybe(t.Date),
        ship_from_zip_code: t.maybe(t.String),
        carrier: t.maybe(t.enums({
            'FedEx':'FedEx',
            'FedEx SmartPost':'FedEx SmartPost',
            'FedEx Freight':'FedEx Freight',
            'UPS':'UPS',
            'UPS Freight':'UPS Freight',
            'UPS Mail Innovations':'UPS Mail Innovations',
            'UPS SurePost':'UPS SurePost',
            'OnTrac':'OnTrac',
            'OnTrac Direct Post':'OnTrac Direct Post',
            'DHL':'DHL',
            'DHL Global Mail':'DHL Global Mail',
            'USPS':'USPS',
            'CEVA':'CEVA',
            'Laser Ship':'Laser Ship',
            'Spee Dee':'Spee Dee',
            'A Duie Pyle':'A Duie Pyle',
            'A1':'A1',
            'ABF':'ABF',
            'APEX':'APEX',
            'Averitt ':'Averitt ',
            'Dynamex':'Dynamex',
            'Eastern Connection':'Eastern Connection',
            'Ensenda':'Ensenda',
            'Estes':'Estes',
            'Land Air Express':'Land Air Express',
            'Lone Star':'Lone Star',
            'Meyer':'Meyer',
            'New Penn':'New Penn',
            'Pilot':'Pilot',
            'Prestige':'Prestige',
            'RBF':'RBF',
            'Reddaway':'Reddaway',
            'RL Carriers':'RL Carriers',
            'Roadrunner':'Roadrunner',
            'Southeastern Freight':'Southeastern Freight',
            'UDS':'UDS',
            'UES':'UES',
            'YRC':'YRC',
            'Other':'Other'
        })),
        carrier_pick_up_date: t.Date
    })
}

function _orderShipment(order) {
    return t.struct({
        shipments: t.list(order_shipped_shipment(order))
    });
}

function _optionsFactory(order) {
    return {
        i18n: {
            add: 'Add',
            down: 'Down',
            optional: '',
            required: " (REQUIRED)",
            remove: 'Remove',
            up: 'Up'
        }
    };
}

module.exports.modelFactory = _orderShipment;
module.exports.optionsFactory = _optionsFactory;