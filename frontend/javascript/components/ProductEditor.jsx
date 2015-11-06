var React = require("react");
var jQuery = require("jquery");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel");

// Tech note. Values containing only white spaces are converted to null.

//var options = {
//    order: ['name', 'surname', 'rememberMe', 'gender', 'age', 'email'],
//    hasError: true,
//    error: <i>A custom error message</i>,
//    help: <i>My form help</i>,
//    legend: <i>My form legend</i>,
//    disabled: true,
//    fields: {
//        name: {
//            // name field configuration here..
//            hasError: true,
//            error: <i>A custom error message</i>,
//            help: <i>My form help</i>,
//            legend: <i>My form legend</i>,
//            disabled: true
//        },
//        surname: {
//            // surname field configuration here..
//        }
//    }
//};

var options = {
    fields: {
        _id: {
            type: 'hidden'
        }
    }
};

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
    var options = {
        fields: {
            _id: {
                type: "hidden"
            }
        }
    };
    if (product._id) {
        options.fields.merchant_sku = options.fields.merchant_sku || {};
        options.fields.merchant_sku.disabled = true;
    }
    return options;
}

module.exports = ProductEditor;