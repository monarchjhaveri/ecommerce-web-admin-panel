var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var moment = require("moment");
var Link = require("react-router").Link;
var connect = require("react-redux").connect;
var ReturnAC = require("../actions/ReturnAC");
var PopoverAC = require("../actions/PopoverAC");
var Constants = require("../Constants");

var t = require('tcomb-form');
var Form = t.form.Form;
var ReturnCompleteModelFactory = require("./models/ReturnCompleteModel").modelFactory;
var ReturnCompleteOptionsFactory = require("./models/ReturnCompleteModel").optionsFactory;

function fetchReturnIfNeeded(return_url_id) {
    var selectedReturn = store.getState().selectedReturn;
    if (selectedReturn && selectedReturn.return_url_id === return_url_id) {
    } else {
        ReturnAC.getDetails(return_url_id);
    }
}

var ReturnComplete = React.createClass({ displayName: "ReturnComplete",
    returnObject: {
        returnObject: React.PropTypes.object
    },
    componentWillMount: function() {
        var return_url_id = this.props.params && this.props.params.return_url_id;
        if (return_url_id) {
            fetchReturnIfNeeded(return_url_id);
        }
    },
    componentWillReceiveProps: function(nextProps){
        var merchant_return_authorization_id = nextProps.params.merchant_order_id;
        if (merchant_return_authorization_id) {
            fetchReturnIfNeeded(merchant_return_authorization_id);
        }
    },
    submitComplete: function() {
        var ValidationResult = this.refs.form.validate();
        var return_url_id = this.props.params && this.props.params.return_url_id;

        if (!return_url_id) {
            PopoverAC.displayErrorFromText("Return not selected.");
        } else if (ValidationResult.errors.length > 0) {
            PopoverAC.displayErrorFromText("Validation failed.");
            ValidationResult.errors.forEach(function(d) {
                console.log(d.message);
                PopoverAC.displayErrorFromText(d.message);
            });
        } else {
            ReturnAC.complete(return_url_id, this.refs.form.getValue());
        }
    },
    getReturnById: function(orderId) {
        return this.props.orders.get(orderId);
    },
    render: function() {
        var return_url_id = this.props.params.return_url_id;
        var selectedReturn = this.props.selectedReturn;

        if (!return_url_id || !selectedReturn) {
            return (
                <div className="col-xs-12">
                    No order selected wtf!
                </div>
            );
        }

        //TODO: See which return_statuses cannot do a COMPLETE call
        //if (!selectedReturn.status || selectedReturn.status !== Constants.ORDER_STATUS.READY) {
        //    return (
        //        <div className="col-xs-12">
        //            Return status MUST be "acknowledged" in order to ship it.
        //        </div>
        //    );
        //}

        var link = "returns/" + this.props.params.return_url_id;
        return (
            <div className="col-xs-12">
                <h3>Complete Return</h3>
                <Form
                    type={ReturnCompleteModelFactory(this.props.selectedReturn)}
                    options={ReturnCompleteOptionsFactory(this.props.selectedReturn)}
                    ref="form"
                    />
                <Link className="btn btn-warning" to={link}>
                    Cancel
                </Link>
                <div className="btn btn-success" onClick={this.submitComplete}>Submit</div>
            </div>
        );
    }
});

function mapStateToProps(state) {
    return {
        selectedReturn: state.selectedReturn
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ReturnComplete);