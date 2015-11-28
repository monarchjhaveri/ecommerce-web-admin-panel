var React = require("react");
var LinkedStateMixin = require("react-addons-linked-state-mixin");
var jQuery = require("jquery");
var Immutable = require("immutable");
var moment = require("moment");
var store = require("../store/store");

var t = require('tcomb-form');
var Form = t.form.Form;

var ProductModel = require("./models/ProductModel").model;
var productModelOptionsFactory = require("./models/ProductModel").optionsFactory;
var ReturnAC = require("../actions/ReturnAC");
var connect = require("react-redux").connect;

var ReturnDetails = React.createClass({ displayName: "ReturnDetails",
    propTypes: {
        selectedReturn: React.PropTypes.object
    },
    componentWillMount: function() {
        var merchant_return_authorization_id = this.props.params && this.props.params.selectedReturn && this.props.params.selectedReturn.merchant_return_authorization_id;
        if (merchant_return_authorization_id) {
            fetchReturnIfNeeded(merchant_return_authorization_id);
        }
    },
    componentWillReceiveProps: function(nextProps){
        var merchantOrderId = nextProps.params.merchant_order_id;
        if (merchantOrderId) {
            fetchReturnIfNeeded(merchantOrderId);
        }
    },
    render: function() {
        var returnItem = this.props.selectedReturn;

        if (!returnItem) {
            return <div>No Item Selected</div>;
        }

        return <div>{JSON.stringify(returnItem)}</div>
    }
});

function timestampToString(timestamp) {
    if (!timestamp) return null;
    var m = moment(timestamp);
    if (!m.isValid()) {
        return timestamp;
    } else {
        return m.format('MMM Do [\']YY, h:mm:ss a');
    }
}


function fetchReturnIfNeeded(merchant_return_authorization_id) {
    var selectedReturn = store.getState().selectedReturn;
    if (selectedReturn && selectedReturn.merchant_return_authorization_id === merchant_return_authorization_id) {
    } else {
        ReturnAC.getDetails(merchant_return_authorization_id);
    }
}

function mapStateToProps(state) {
    return {
        selectedReturn: state.selectedReturn
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ReturnDetails);