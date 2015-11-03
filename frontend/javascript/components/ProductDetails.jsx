var React = require("react");

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
            if (!value instanceof Array) {
                return "Invalid SPC's";
            }

            var spcDoms = [];
            for (var i = 0; i < value.length; i++) {
                spcDoms.push(
                    <li>{value[i].standard_product_code_type}: {value[i].standard_product_code}</li>
                );
            }
            return (
                <ul>
                    {spcDoms}
                </ul>
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
        product: React.PropTypes.object
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
    getContent: function() {
        var self = this;
        if (self.props.product) {
            return (
                self.renderFields(self.props.product)
            );
        } else {
            return null;
        }
    },
    render: function() {
        return (
          <div className="product-details">
              {this.getContent()}
          </div>
        );
    }
});

module.exports = ProductDetails;