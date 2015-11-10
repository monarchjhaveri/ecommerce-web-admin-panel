var React = require("react");

var LoadingModal = React.createClass({ displayName:"LoadingModal",
    propTypes: {
        visible: React.PropTypes.bool
    },
    render: function() {
        if (this.props.visible) {
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