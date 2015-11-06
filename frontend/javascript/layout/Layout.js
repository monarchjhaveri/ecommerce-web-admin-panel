var React = require("react");
var Header = require("./Header");
var Footer = require("./Footer");
var Popovers = require("./Popovers");
var LoadingModal = require("./LoadingModal");

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

module.exports = Layout;