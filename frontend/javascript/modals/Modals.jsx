var React = require("react");
var Immutable = require("immutable");

var connect = require("react-redux").connect;

var Popovers = require("./Popovers.jsx");
var LoadingModal = require("./LoadingModal.jsx");

var Modals = React.createClass({ displayName:"Modals",
    propTypes: {
        state: React.PropTypes.object
    },
    getIsLoading: function() {
        return this.props.state && this.props.state.loading;
    },
    getPopovers: function() {
        return this.props.state && this.props.state.popovers;
    },
    render: function() {

        return (
            <span>
                <LoadingModal visible={this.getIsLoading()}/>
                <Popovers popovers={this.getPopovers()}/>
            </span>
        )
    }
});

function mapStateToProps(state) {
    return {
        state: state
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Modals);