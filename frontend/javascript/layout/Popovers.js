var React = require("react");

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
            return (
                <div className={className} key={d.popoverId}>
                    ERROR: {d.message}
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