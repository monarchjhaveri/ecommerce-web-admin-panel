var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

function modelFactory(fulfillmentNodes) {
    var options = {};
    for (var i = 0; i < fulfillmentNodes.length; i++) {
        var f = fulfillmentNodes[i];
        options[f.FulfillmentNodeId] = f.Name;
    }
    return t.struct({
        price: t.Number,
        fulfillment_nodes: t.list(t.struct({
            fulfillment_node_id: t.enums(options),
            fulfillment_node_price: t.Number
        }))
    });
}

/**
 * @param product
 * @returns {{}}
 */
var optionsFactory = function optionsFactory() {
    return {
        fields: {
            price: {
                label: "Overall Price"
            },
            fulfillment_nodes: {
                label: "Fulfillment Node Prices"
            }
        }
    }
};

module.exports.modelFactory = modelFactory;
module.exports.optionsFactory = optionsFactory;