var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var t = require('tcomb-form');
var Form = t.form.Form;
var ProductAC = require("../actions/ProductAC");

var ProductPriceModelFactory = require("./models/ProductPriceModel").modelFactory;
var ProductPriceOptionsFactory = require("./models/ProductPriceModel").optionsFactory;

var ProductPrice = React.createClass({ displayName: "ProductPrice",
    propTypes: {
        product: React.PropTypes.object,
        price: React.PropTypes.object,
        onSubmitPrice: React.PropTypes.func,
        fulfillmentNodes: React.PropTypes.array
    },
    getInitialState: function() {
        return {};
    },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.product &&
            this.state.editorPrice &&
            nextProps.product.merchant_sku === this.state.editorPrice.merchant_sku) {
            var editorPrice = jQuery.extend(true, {}, nextProps.product);
            this.setState({editorPrice: editorPrice});
        }
        if (nextProps.product &&
            this.state.loadingPriceFor &&
            this.state.loadingPriceFor !== nextProps.product.merchant_sku) {
            this.setState({loadingPriceFor: null, loadingPrice: false})
        }
    },
    submitEdit: function() {
        this.props.onSubmitPrice(this.refs.form.getValue());
    },
    createForm: function() {
        return <Form
            type={ProductPriceModelFactory(this.props.fulfillmentNodes)}
            value={this.props.price}
            options={ProductPriceOptionsFactory()}
            ref="form"
        />
    },
    getPrice: function() {
        if (!this.props.product || !this.props.product.merchant_sku) {
            return;
        } else {
            this.setState({loadingPrice: true, loadingPriceFor: this.props.product.merchant_sku});
            ProductAC.getPrice(this.props.product)
        }
    },
    render: function() {
        if (!this.props.product) {
            return null;
        } else if (this.props.fulfillmentNodes && this.props.price) {
            return <div className="product-price">
                <h2>Price</h2>
                {this.createForm()}
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        } else if (this.state.loadingPrice) {
            return <div className="product-price">
                <h2>Price</h2>
                Loading...
            </div>;
        } else {
            return <div className="product-price">
                <h2>Price</h2>
                <div className="btn btn-success" onClick={this.getPrice}>Load Price</div>
            </div>;
        }
    }
});

module.exports = ProductPrice;