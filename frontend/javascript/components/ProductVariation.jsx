var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var t = require('tcomb-form');
var Form = t.form.Form;
var ProductAC = require("../actions/ProductAC");

var ProductVariationModelFactory = require("./models/ProductVariationModel").modelFactory;
var ProductVariationOptionsFactory = require("./models/ProductVariationModel").optionsFactory;

function getVariationForProduct(product) {
    var merchant_sku = product ? product.merchant_sku : null;
    if (!merchant_sku) {
        return {};
    }

    return {
        relationship: product.relationship,
        variation_refinements: product.variation_refinements ? product.variation_refinements : null,
        children_skus: product.children_skus ? product.children_skus.map(function(d){return d.merchant_sku}) : null
    };
}

var ProductVariation = React.createClass({ displayName: "ProductVariation",
    propTypes: {
        product: React.PropTypes.object,
        variation: React.PropTypes.object,
        onSubmitVariation: React.PropTypes.func,
        fulfillmentNodes: React.PropTypes.array
    },
    getInitialState: function() {
        return {open: false};
    },
    loadVariants: function() {
      this.setState({open: true});
    },
    componentWillReceiveProps: function(nextProps, oldProps) {
        var newSku = nextProps.product && nextProps.product.merchant_sku;
        var oldSku = oldProps.product && oldProps.product.merchant_sku;
        if (newSku != oldSku || !newSku || !oldSku) {
            this.setState({open: false});
        }
    },
    submitEdit: function() {
        this.props.onSubmitVariation(this.refs.form.getValue());
    },
    createForm: function() {
        return <Form
            type={ProductVariationModelFactory()}
            value={getVariationForProduct(this.props.product)}
            options={ProductVariationOptionsFactory()}
            ref="form"
        />
    },
    render: function() {
        if (!this.props.product || !this.props.product.merchant_sku) {
            return null;
        }

        if (this.state.open) {
            return <div className="product-variation">
                <h2>Variation</h2>
                {this.createForm()}
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        } else {
            return <div className="product-variation">
                <h2>Variation</h2>
                <div className="btn btn-success" onClick={this.loadVariants}>Load Variants</div>
            </div>
        }
    }
});

module.exports = ProductVariation;