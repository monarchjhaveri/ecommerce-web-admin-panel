var React = require("react");
var Immutable = require("immutable");

var Constants = require("../Constants");
var store = require("../store/store");
var connect = require("react-redux").connect;
var Link = require("react-router").Link;

var RefundAC= require("../actions/RefundAC");

var filterByStatusOptions = [
    {value: Constants.REFUND_STATUS.CREATED, label: "Created"},
    {value: Constants.REFUND_STATUS.PROCESSING, label: "Processing"},
    {value: Constants.REFUND_STATUS.ACCEPTED, label: "Accepted"},
    {value: Constants.REFUND_STATUS.REJECTED_CUSTOMER_CARD_INVALID, label: "Rejected - Customer Card Invalid"},
    {value: Constants.REFUND_STATUS.REJECTED_CONFLICTS_WITH_RETURN_POLICY, label: "Rejected - Conflicts with Return Policy"}
].map(function(d) {
    return <option value={d.value} key={d.value}>{d.label}</option>
});

var RefundsView = React.createClass({ displayName:"RefundsView",
    propTypes: {
        inventory: React.PropTypes.object,
        products: React.PropTypes.object,
        selectedProduct: React.PropTypes.object,
        selectedPrice: React.PropTypes.object,
        productDetails: React.PropTypes.object,
        refundsFilter: React.PropTypes.object
    },
    fetchRefunds: function(){
        RefundAC.fetchAll(this.props.refundsFilter.get("status"));
    },
    handleRefundsFilterStatusChange: function(ev) {
        var newValue = ev.target.value;
        RefundAC.setFilter(newValue);
    },
    getSelectedRefundId: function() {
        var selectedRefundId = this.props.router && this.props.router.params && this.props.router.params.refund_url_id;
        return selectedRefundId ? selectedRefundId : null;
    },
    getRefundElements: function() {
        var refunds = this.props.refunds.toList();
        var className = "sidebar-select-list-item";
        var selectedRefundId = this.getSelectedRefundId();
        var refundsDOM = refunds.map(function(d) {
            var thisClassName = selectedRefundId && d.refund_url_id === selectedRefundId ? className + " selected" : className;
            return (
                <div key={d.refund_url_id} className={thisClassName}>
                    <Link to={"refunds/" + d.refund_url_id}>
                        {d.refund_url_id}
                    </Link>
                </div>
            )
        });
        return refundsDOM;
    },
    getRightViewColumn: function() {
        if (!this.getSelectedRefundId()) {
            return null;
        }
        
        var links = [];

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
                         onClick={this.fetchRefunds}>
                        Fetch Refunds
                    </div>
                    <div className="sidebar-list-button">
                        <div className="sidebar-list-button-panel">
                            <select
                                value={this.props.refundsFilter.get("state")}
                                onChange={this.handleRefundsFilterStatusChange} >
                                {filterByStatusOptions}
                            </select>
                        </div>
                    </div>
                    <div className="sidebar-select-list">
                        {this.getRefundElements()}
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
        refunds: state.refunds,
        selectedRefund: state.selectedRefund,
        refundDetails: state.refundDetails,
        refundsFilter: state.refundsFilter,
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(RefundsView);