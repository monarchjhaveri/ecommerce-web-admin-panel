var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var t = require('tcomb-form');
var Form = t.form.Form;
var ProductAC = require("../actions/ProductAC");

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
        if (nextProps.product &&
            this.state.loadingInventoryFor &&
            this.state.loadingInventoryFor !== nextProps.product.merchant_sku) {
            this.setState({loadingInventoryFor: null, loadingInventory: false})
        }
    },
    submitEdit: function() {
        this.props.onSubmitInventory(this.refs.form.getValue());
    },
    createForm: function() {
        console.log("The value", this.props.inventory);
        return <Form
            type={ProductInventoryModelFactory(this.props.fulfillmentNodes)}
            value={this.props.inventory}
            options={ProductInventoryOptionsFactory()}
            ref="form"
        />
    },
    getInventory: function() {
        if (!this.props.product || !this.props.product.merchant_sku) {
            return;
        } else {
            this.setState({loadingInventory: true, loadingInventoryFor: this.props.product.merchant_sku});
            ProductAC.getInventory(this.props.product)
        }
    },
    render: function() {
        if (!this.props.product) {
            return null;
        } else if (this.props.fulfillmentNodes && this.props.inventory) {
            return <div className="view-right-column-section">
                <h2>Inventory</h2>
                {this.createForm()}
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        } else if (this.state.loadingInventory) {
            return <div className="view-right-column-section">
                <h2>Inventory</h2>
                Loading...
            </div>;
        } else {
            return <div className="view-right-column-section">
                <h2>Inventory</h2>
                <div className="btn btn-success" onClick={this.getInventory}>Load Products</div>
            </div>;
        }
    }
});

module.exports = ProductInventory;