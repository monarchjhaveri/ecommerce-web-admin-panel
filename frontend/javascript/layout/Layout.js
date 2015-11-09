var React = require("react");
var Header = require("./Header");
var Footer = require("./Footer");
var Popovers = require("./Popovers");
var LoadingModal = require("./LoadingModal");
var connect = require("react-redux").connect;

var Layout = React.createClass({ displayName:"Layout",
    render: function() {
        return (
            <div className="layout-wrapper">
                <Header/>
                <Footer/>
                <LoadingModal visible={this.props.state.loading}/>
                <Popovers popovers={this.props.state.popovers}/>
            </div>
        );
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(Layout);