var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var t = require('tcomb-form');
var Form = t.form.Form;

var ProductInventoryModelFactory = require("./models/ProductInventoryModel").modelFactory;
var ProductInventoryOptionsFactory = require("./models/ProductInventoryModel").optionsFactory;

var ProductInventory = React.createClass({ displayName: "ProductInventory",
    propTypes: {
        product: React.PropTypes.object,
        inventory: React.PropTypes.object,
        onSubmitInventory: React.PropTypes.func,
        fulfillmentNodes: React.PropTypes.array
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
    createForm: function() {
        var options = ProductInventoryOptionsFactory();
        return <Form
            type={ProductInventoryModelFactory(this.props.fulfillmentNodes)}
            value={null}
            options={options}
            ref="form"
        />
    },
    render: function() {
        if (this.props.product && this.props.fulfillmentNodes) {
            return <div className="product-inventory">
                {this.createForm()}
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        } else {
            return <div className="product-inventory">
                Loading...
            </div>;
        }
    }
});

module.exports = ProductInventory;