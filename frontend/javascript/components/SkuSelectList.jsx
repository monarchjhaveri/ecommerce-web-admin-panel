var React = require("react");

var SkuSelectList = React.createClass({ displayName: "SkuSelectList",
    propTypes: {
        skus: React.PropTypes.object.isRequired,
        selectedSku: React.PropTypes.string.isRequired,
        onSelectChange: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            <div className="sku-select-list">
                {_createSkusArray(this.props.skus, this.props.selectedSku, this.props.onSelectChange)}
            </div>
        );
    }
});


function _createSkusArray(skus, selectedSku, onSelectChange) {
    console.log("_createSkusArray called with", skus);
    if (!skus) {
        return [];
    }

    return skus.map(function(d) {
        console.log(d);
        return (
            <div className="sku-select-list-item" onClick={returnSkuFunctionBuilder(d, onSelectChange)}>
                {d.sku}
            </div>
        )
    });
}

function returnSkuFunctionBuilder(product, callback) {
    return function() {
        callback(product.sku);
    }
}

module.exports = SkuSelectList;