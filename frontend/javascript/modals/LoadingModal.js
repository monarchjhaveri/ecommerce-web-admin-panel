var React = require("react");

var LoadingModal = React.createClass({ displayName:"LoadingModal",
    render: function() {
        if (this.props.loading) {
            return (
                <div className="loading-modal">
                    <div className="loading-message">
                        <span>Loading...</span>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = LoadingModal;