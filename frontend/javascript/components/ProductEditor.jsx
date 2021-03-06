var React = require("react");
var jQuery = require("jquery");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel").model;
var productModelOptionsFactory = require("./models/ProductModel").optionsFactory;

var PopoverAC = require("../actions/PopoverAC");

// Tech note. Values containing only white spaces are converted to null.

var ProductEditor = React.createClass({displayName:"ProductEditor",
    submitEdit: function() {
        var ValidationResult = this.refs.form.validate();

        if (ValidationResult.errors.length > 0) {
            PopoverAC.displayErrorFromText("Validation failed.");
            ValidationResult.errors.forEach(function(d) {
                console.log(d.message);
                PopoverAC.displayErrorFromText(d.message);
            });
        } else {
            this.props.submitEdit(ValidationResult.value);
        }
    },
    forceUpdateForm: function() {
        var newValue = jQuery("input[name=category_path]")[0].value;
        this.refs.form.refs.input.refs.category_path.setState({value: newValue});
    },
    createForm: function(product) {
        var options = productModelOptionsFactory(product);
        return (
            <Form
                type={ProductModel}
                value={product}
                options={options}
                ref="form"
                onChange={this.forceUpdateForm}
            />
        )
    },
    render: function() {
        return (
            <div className="view-details">
                {this.createForm(this.props.product)}
                <div className="btn btn-warn" onClick={this.props.cancelEdit}>Cancel</div>
                <div className="btn btn-success" onClick={this.submitEdit}>Submit</div>
            </div>
        );
    }
});


module.exports = ProductEditor;