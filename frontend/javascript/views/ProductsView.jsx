var React = require("react");
var Immutable = require("immutable");

var Product = require ("./../components/Product.jsx");
var SkuSelectList = require("../components/SkuSelectList.jsx");

var store = require("../store/store");

var SkusAC = require("../actions/SkusAC");

var ProductsView = React.createClass({ displayName:"ProductsView",
    onSelectChange: function(sku){
        store.dispatch(SkusAC.select(sku));
        store.dispatch(SkusAC.getDetails(sku));
    },
    render: function() {
        return (
            <div className="view products-view">
                <SkuSelectList
                    skus={this.props.skus}
                    selectedSku={this.props.selectedSku}
                    onSelectChange={this.onSelectChange}
                />
            </div>
        )
    }
});

module.exports = ProductsView;