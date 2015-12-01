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

function fetchReturnIfNeeded(return_url_id) {
    var selectedReturn = store.getState().selectedReturn;
    if (selectedReturn && selectedReturn.return_url_id === return_url_id) {
    } else {
        ReturnAC.getDetails(return_url_id);
    }
}

var ReturnDetails = React.createClass({ displayName: "ReturnDetails",
    propTypes: {
        selectedReturn: React.PropTypes.object
    },
    componentWillMount: function() {
        var return_url_id = this.props.params && this.props.params.return_url_id;
        if (return_url_id) {
            fetchReturnIfNeeded(return_url_id);
        }
    },
    componentWillReceiveProps: function(nextProps){
        var merchantOrderId = nextProps.params.return_url_id;
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