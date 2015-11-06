var React = require("react");
var jQuery = require("jquery");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel");

// Tech note. Values containing only white spaces are converted to null.

var ProductEditor = React.createClass({displayName:"ProductEditor",
    submitEdit: function() {
        var value = this.refs.form.getValue();

        // getValue returns null if validation failed
        if (value) {
            this.props.submitEdit(value);
        }
    },
    createForm: function(product) {
        var options = _generateFormOptions(product);
        return (
            <Form
                type={ProductModel}
                value={product}
                options={options}
                ref="form"
            />
        )
    },
    render: function() {
        return (
            <div className="product-details editor">
                {this.createForm(this.props.product)}
                <div className="btn btn-warn" onClick={this.props.cancelEdit}>Cancel</div>
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        );
    }
});

function _generateFormOptions(product) {
    return {
        fields: {
            _id: {
                type: "hidden"
            },
            merchant_sku: {
                disabled: product._id ? true : false
            }
        }
    };
}

module.exports = ProductEditor;