var React = require("react");
var PopoverAC = require("../actions/PopoverAC.js");

var Popovers = React.createClass({ displayName: "Popovers",
    propTypes: {
        popovers: React.PropTypes.object
    },
    render: function() {
        if (!this.props.popovers) {
            return null;
        }

        var elements = this.props.popovers.map(function(d) {
            var className = "popover popover-" + d.type;
            var jsonObject;
            try {
                jsonObject = JSON.parse(d.message);
            } catch (e) {
                jsonObject = {
                    message: "UNKNOWN ERROR, Failed to parse JSON. Content is below.",
                    stack: d.message
                }
            }
            return (
                <div className={className} key={d.popoverId}>
                    <span className="btn btn-default close-button" onClick={function(){PopoverAC.clearPopover(d.popoverId)}}>Close</span>
                    <span className="popover-title">ERROR: {jsonObject.message}</span>
                    <span className="popover-stack">{jsonObject.stack}</span>
                </div>
            )
        });

        return (
            <div className="popovers-container">
                {elements}
            </div>
        );
    }
});

module.exports = Popovers;