var React = require("react");

var Header = React.createClass({
    render: function() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a href="#" className="navbar-brand">Admin Panel</a>
                    </div>
                </div>
            </nav>
        )
    }
});

module.exports = Header;