var React = require("react");
var Immutable = require("immutable");

var Product = require ("./../components/Product.jsx");
var SkuSelectList = require("../components/SkuSelectList.jsx");

var ProductsView = React.createClass({ displayName:"ProductsView",
    onSelectChange: function(sku){
        console.log(sku);
    },
    render: function() {
        console.log("Dispatch?", this.props);
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