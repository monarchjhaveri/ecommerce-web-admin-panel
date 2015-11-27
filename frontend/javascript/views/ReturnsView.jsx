var React = require("react");
var Immutable = require("immutable");

var Constants = require("../Constants");
var store = require("../store/store");
var connect = require("react-redux").connect;
var Link = require("react-router").Link;

var ReturnAC= require("../actions/ReturnAC");

var filterByStatusOptions = [
    {value: Constants.RETURN_STATUS.ACKNOWLEDGED, label: "Acknowledged"},
    {value: Constants.RETURN_STATUS.CREATED, label: "Created"},
    {value: Constants.RETURN_STATUS.COMPLETED_BY_MERCHANT, label: "Completed By Merchant"},
    {value: Constants.RETURN_STATUS.REFUND_CUSTOMER_WITHOUT_RETURN, label: "Refund Customer Without Return"},
    {value: Constants.RETURN_STATUS.JET_REFUNDED, label: "Jet Refunded"}
].map(function(d) {
        return <option value={d.value} key={d.value}>{d.label}</option>
    });

var ReturnsView = React.createClass({ displayName:"ReturnsView",
    propTypes: {
        inventory: React.PropTypes.object,
        products: React.PropTypes.object,
        selectedProduct: React.PropTypes.object,
        selectedPrice: React.PropTypes.object,
        productDetails: React.PropTypes.object,
        returnsFilter: React.PropTypes.object
    },
    fetchReturns: function(){
        ReturnAC.fetchAll(this.props.returnsFilter.get("status"));
    },
    handleReturnsFilterStatusChange: function(ev) {
        var newValue = ev.target.value;
        ReturnAC.setFilter(newValue);
    },
    getOrderElements: function(){

    },
    getRightViewColumn: function() {

    },
    render: function() {
        var self = this;
        return (
            <div className="view">
                <div className="view-sidebar">
                    <div className="sidebar-list-button btn btn-small btn-info"
                         onClick={this.fetchReturns}>
                        Fetch Returns
                    </div>
                    <div className="sidebar-list-button">
                        <div className="sidebar-list-button-panel">
                            <select
                                value={this.props.returnsFilter.get("state")}
                                onChange={this.handleReturnsFilterStatusChange} >
                                {filterByStatusOptions}
                            </select>
                        </div>
                    </div>
                    <div className="sidebar-select-list">
                        {this.getOrderElements()}
                    </div>
                </div>
                <div className="view-details">
                    {this.props.children}
                </div>
                {this.getRightViewColumn()}
            </div>

        );
    }
});

function mapStateToProps(state) {
    return {
        products: state.products,
        selectedProduct: state.selectedProduct,
        returns: state.returns,
        selectedReturn: state.selectedReturn,
        returnDetails: state.returnDetails,
        returnsFilter: state.returnsFilter,
        router: state.router
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ReturnsView);