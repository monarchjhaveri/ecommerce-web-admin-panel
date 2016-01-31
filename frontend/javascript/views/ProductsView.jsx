var React = require("react");
var Immutable = require("immutable");

var ProductDetails = require ("./../components/ProductDetails.jsx");
var ProductInventory = require ("./../components/ProductInventory.jsx");
var ProductPrice = require ("./../components/ProductPrice.jsx");
var ProductVariation = require ("./../components/ProductVariation.jsx");
var ProductSelectList = require("../components/ProductSelectList.jsx");
var CategoryLookupBox = require("../components/CategoryLookupBox.jsx");

var store = require("../store/store");
var connect = require("react-redux").connect;
var Link = require("react-router").Link;

var ProductAC = require("../actions/ProductAC");

var ProductsView = React.createClass({ displayName:"ProductsView",
    propTypes: {
        inventory: React.PropTypes.object,
        products: React.PropTypes.object,
        selectedProduct: React.PropTypes.object,
        selectedPrice: React.PropTypes.object,
        productDetails: React.PropTypes.object
    },
    onSelectChange: function(product){
        ProductAC.getDetails(product);
    },
    submitEdit: function(product){
        if (product._id) {
            ProductAC.edit(product);
        } else {
            ProductAC.create(product);
        }
    },
    onDelete: function(product) {
        ProductAC.delete(product);
    },
    getSelectedProduct: function() {
        return this.props.selectedProduct ? this.props.selectedProduct : null;
    },
    submitInventory: function(value) {
        if (value) {
            ProductAC.editInventory({
                product: this.props.selectedProduct,
                payload: value
            });
        }
    },
    submitPrice: function(value) {
        if (value) {
            ProductAC.editPrice({
                product: this.props.selectedProduct,
                payload: value
            });
        }
    },
    submitVariation: function(value) {
        if (value) {
            ProductAC.editVariation({
                product: this.props.selectedProduct,
                payload: value
            });
        }
    },
    getInventoryForProduct(product) {
        var merchant_sku = product ? product.merchant_sku : null;
        if (!merchant_sku || !this.props.productInventory || !this.props.productInventory.get(merchant_sku)) {
            return null;
        }

        return this.props.productInventory.get(merchant_sku);
    },
    getPriceForProduct(product) {
        var merchant_sku = product ? product.merchant_sku : null;
        if (!merchant_sku || !this.props.productPrice || !this.props.productPrice.get(merchant_sku)) {
            return null;
        }

        return this.props.productPrice.get(merchant_sku);
    },
    getCategoryLookupBox() {
        return this.props.selectedProduct ? <CategoryLookupBox/> : null;
    },
    render: function() {
        return (
            <div className="view">
                <ProductSelectList
                    products={this.props.products}
                    selectedProduct={this.props.selectedProduct}
                    onSelectChange={this.onSelectChange}
                    />
                {this.props.selectedProduct ? <ProductDetails
                    product={this.props.selectedProduct}
                    submitEdit={this.submitEdit}
                    onDelete={this.onDelete}
                    /> : undefined}
                <div className="view-right-column">
                    <ProductInventory
                        product={this.props.selectedProduct}
                        inventory={this.getInventoryForProduct(this.props.selectedProduct)}
                        fulfillmentNodes={this.props.merchant.get("fulfillmentNodes")}
                        onSubmitInventory={this.submitInventory}
                    />
                    <ProductPrice
                        product={this.props.selectedProduct}
                        price={this.getPriceForProduct(this.props.selectedProduct)}
                        fulfillmentNodes={this.props.merchant.get("fulfillmentNodes")}
                        onSubmitPrice={this.submitPrice}
                    />
                    <ProductVariation
                        product={this.props.selectedProduct}
                        onSubmitVariation={this.submitVariation}
                    />
                    {this.getCategoryLookupBox()}

                </div>
            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        products: state.products,
        inventory: state.inventory,
        selectedProduct: state.selectedProduct,
        merchant: state.merchant,
        productInventory: state.productInventory,
        productPrice: state.productPrice,
        productVariation: state.productVariation,
        router: state.router
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ProductsView);