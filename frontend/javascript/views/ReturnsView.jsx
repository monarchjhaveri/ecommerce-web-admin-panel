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
    getSelectedReturnId: function() {
        var selectedReturnId = this.props.router && this.props.router.params && this.props.router.params.return_url_id;
        return selectedReturnId ? selectedReturnId : null;
    },
    getReturnElements: function() {
        var returns = this.props.returns.toList();
        var className = "sidebar-select-list-item";
        var selectedReturnId = this.getSelectedReturnId();
        var returnsDOM = returns.map(function(d) {
            var thisClassName = selectedReturnId && d.return_url_id === selectedReturnId ? className + " selected" : className;
            return (
                <div key={d.return_url_id} className={thisClassName}>
                    <Link to={"returns/" + d.return_url_id}>
                        {d.return_url_id}
                    </Link>
                </div>
            )
        });
        return returnsDOM;
    },
    getRightViewColumn: function() {
        if (!this.getSelectedReturnId()) {
            return null;
        }

        var returnStatus = this.getSelectedReturnId() && this.getSelectedReturnId().return_status;

        /*
         JET_REFUNDED: "jetRefunded",
         COMPLETED_BY_MERCHANT: "completedByMerchant",
         REFUND_CUSTOMER_WITHOUT_RETURN: "refundCustomerWithoutReturn",
         ACKNOWLEDGED: "acknowledged",
         CREATED: "created"
         */

        //TODO: find out which status can be completed
        //if (returnStatus === Constants.RETURN_STATUS.ACKNOWLEDGED || returnStatus === Constants.RETURN_STATUS.CREATED ) {
        //    links.push(_createLinkButton("returns/" + this.getSelectedReturnId() + "/complete", "Complete"));
        //}

        var links = [];

        if (1 === 1) {
            links.push(_createLinkButton("returns/" + this.getSelectedReturnId() + "/complete", "Complete"));
        }

        return (
            <div className="view-right-column">
                <h3>Options</h3>
                {links}
            </div>
        )
    },
    render: function() {
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
                        {this.getReturnElements()}
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

function _createLinkButton(link, label) {
    return (
        <Link className="btn btn-default" to={link} key={label+link}>
            {label}
        </Link>
    );
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ReturnsView);