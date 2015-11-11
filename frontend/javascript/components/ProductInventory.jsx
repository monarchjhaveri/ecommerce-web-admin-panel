var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var t = require('tcomb-form');
var Form = t.form.Form;

var ProductInventoryModel = require("./models/ProductInventoryModel").model;
var ProductInventoryOptionsFactory = require("./models/ProductInventoryModel").optionsFactory;

var ProductInventory = React.createClass({ displayName: "ProductInventory",
    propTypes: {
        product: React.PropTypes.object,
        inventory: React.PropTypes.object,
        onSubmitInventory: React.PropTypes.func
    },
    getInitialState: function() {
        return {};
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.product &&
            this.state.editorInventory &&
            nextProps.product.merchant_sku === this.state.editorInventory.merchant_sku) {
            var editorInventory = jQuery.extend(true, {}, nextProps.product);
            this.setState({editorInventory: editorInventory});
        }
    },
    submitEdit: function(value) {
        this.props.onSubmitInventory(value);
    },
    createForm: function(inventory) {
        var options = ProductInventoryOptionsFactory();
        return <Form
            type={ProductInventoryModel}
            value={null}
            options={options}
            ref="form"
        />
    },
    render: function() {
        if (this.props.product && this.props.inventory) {
            return <div className="product-inventory">
                {this.createForm(this.props.inventory)}
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        } else {
            return <div className="product-inventory">
                {this.createForm(this.props.inventory)}
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>;
        }
    }
});

module.exports = ProductInventory;