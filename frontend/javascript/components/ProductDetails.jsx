var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");

var ProductEditor = require("./ProductEditor.jsx");
var ProductAC = require("../actions/ProductAC");

// Sample product
/*
{
    "ASIN":"TestTest10",
    "correlation_id":"map-5c7e058d28c041d2a93dbb51e27081e1",
    "inventory_by_fulfillment_node":[],
    "merchant_id":"c163f4f1379140d0982d18c443a1852f",
    "merchant_sku":"1",
    "merchant_sku_id":"c48056d95fe74dae81dc4667e247a1af",
    "multipack_quantity":10,
    "product_title":"Test Product",
    "sku_last_update":"2015-10-12T09:35:11.6347408+00:00",
    "status":"Processing",
    "sub_status":[]
}
*/
var fields = [
    {
        className: "product-title",
        label: "Product Title",
        property: "product_title"
    },
    {
        className: "merchant-sku",
        label: "Merchant SKU",
        property: "merchant_sku"
    },
    {
        className: "multipack-quantity",
        label: "Multipack Quantity",
        property: "multipack_quantity"
    },
    {
        className: "standard-product-codes",
        label: "Standard Product Codes",
        property: "standard_product_codes",
        valueRenderFactory: function(value, data) {
            if (!(value instanceof Array)) {
                return "Invalid SPC's";
            }

            var spcDoms = [];
            for (var i = 0; i < value.length; i++) {
                var textString = value[i].standard_product_code_type + ": " + value[i].standard_product_code;
                spcDoms.push(
                    <li key={textString}>{textString}</li>
                );
            }
            return (
                <ul>
                    {spcDoms}
                </ul>
            )
        },
        /**
         *
         * @param field
         * @param defaultValue
         * @param data
         * @returns {*}
         */
        editorRenderFactory: function(field, defaultValue, data) {
            if (!defaultValue instanceof Array) {
                return "Invalid SPC's";
            }

            var spcDoms = [];
            for (var i = 0; i < defaultValue.length; i++) {
                var f = defaultValue[i];
                var key = f.standard_product_code_type + f.standard_product_code;
                var label = f.standard_product_code_type;
                var originalValue = f.standard_product_code;

                spcDoms.push(
                    <li key={"li:"+key}>
                        <label key={"label:"+key}>
                            {label}
                            <input key={"input:"+key} type="text" defaultValue={originalValue}></input>
                        </label>
                    </li>
                );
            }
            return (
                <div className="standard-product-codes">
                    <label>Standard Product Codes:</label>
                    <ul>
                        {spcDoms}
                    </ul>
                </div>
            )
        }
    }
    //{
    //    className: "asin",
    //    label: "ASIN",
    //    property: "ASIN"
    //},
    //{
    //    className: "sku-last-update",
    //    label: "SKU Last Updated",
    //    property: "sku_last_update",
    //    valueRenderFactory: function(value, data) {
    //        var dateString;
    //        try {
    //            dateString = new Date(value).toDateString();
    //        } catch (e) {
    //            // do nothing;
    //        }
    //        return dateString;
    //    }
    //},
    //{
    //    className: "status",
    //    label: "Status",
    //    property: "status"
    //},
    //{
    //    className: "sub-status",
    //    label: "Sub Status",
    //    property: "sub_status"
    //}
];
var ProductDetails = React.createClass({ displayName: "ProductDetails",
    propTypes: {
        product: React.PropTypes.object,
        onEdit: React.PropTypes.func,
        onDelete: React.PropTypes.func
    },
    renderFields(product) {
        var renderedDOM = [];
        for (var i = 0; i < fields.length; i++) {
            var f = fields[i];
            var key = f.property;
            var className = f.className;
            var label = f.label;
            var value = f.valueRenderFactory ? f.valueRenderFactory(product[f.property], product) : product[f.property];
            renderedDOM.push(
                <div key={key} className={className}> {label}: {value}</div>
            );
        }
        return renderedDOM;
    },
    cancelEdit: function() {
        ProductAC.clearSelection();
    },
    onDelete: function() {
        this.props.onDelete(this.props.product);
    },
    submitEdit: function(value) {
        this.props.submitEdit(value);
    },
    render: function() {
        if (this.props.product) {
            return <ProductEditor
                product={this.props.product}
                cancelEdit={this.cancelEdit}
                submitEdit={this.submitEdit}
                onDelete={this.onDelete}
                />;
        } else {
            return null;
        }
    }
});

module.exports = ProductDetails;