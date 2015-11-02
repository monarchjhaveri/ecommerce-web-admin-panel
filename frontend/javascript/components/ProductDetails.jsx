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
var ProductDetails = React.createClass({ displayName: "ProductDetails",
    propTypes: {
        product: React.PropTypes.object
    },
    getMerchantSku: function() {
      return this.props.product && this.props.product.merchant_sku;
    },
    getContent: function() {
        var self = this;
        if (self.props.product) {
            return (
                <div className="product-details-view">
                    <div className="merchant-sku">Merchant SKU: {self.getMerchantSku()}</div>
                </div>
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