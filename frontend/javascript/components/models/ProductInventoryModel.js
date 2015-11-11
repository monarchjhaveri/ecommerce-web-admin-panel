var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

var ProductInventoryModel = t.struct({
    fulfillment_nodes: t.list(t.struct({
        fulfillent_node_id: t.Str,
        quantity: t.Number
    }))
});

/**
 * @param product
 * @returns {{}}
 */
var optionsFactory = function optionsFactory() {
    return {
        fields: {
            fulfillment_nodes: {
                label: "Prices"
            }
        }
    }
};

module.exports.model = ProductInventoryModel;
module.exports.optionsFactory = optionsFactory;