var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");
var OptionsHelper= require("./OptionsHelper");

function modelFactory() {
    return t.struct({
        relationship: t.enums({
            "Accessory": "Accessory",
            "Variation": "Variation"
        }),
        variation_refinements: t.list(t.Number),
        children_skus: t.list(t.String)
    });
}

var optionsFactory = function optionsFactory() {
    return {
        fields: {
            relationship: OptionsHelper.helpRenderers.helpBoxOnly('This field is required if you are setting up a Variation relationship between a set merchant SKUs'),
            variation_refinements: OptionsHelper.helpRenderers.helpBoxOnly('The attribute IDs associated with the characteristic the parent-children SKUs relate on. Valid values: A Jet attribute or attributes that were uploaded for the products associated with the variation'),
            children_skus: OptionsHelper.helpRenderers.helpBoxOnly('The merchant SKUs that are a the child SKUs. Valid values: Must be an uploaded merchant SKU')
        }
    }
};

module.exports.modelFactory = modelFactory;
module.exports.optionsFactory = optionsFactory;