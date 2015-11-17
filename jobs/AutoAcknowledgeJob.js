var JetService = require("../services/JetService/JetService");

// acknowledge every 3 minutes
// if acknowledge fails at any point, tries to reacknowledge every 1 minute until successful
var AUTO_ACKNOWLEDGEMENT_INTERVAL = 3 * 60 * 1000;
var AUTO_ACKNOWLEDGEMENT_INTERVAL_IF_FAILED = 60 * 1000;
var autoAcknowledgeLoopStarted = false;

function _autoAcknowledge_getOrdersLoop(callback) {
    async.waterfall(
        function(callback) {
            JetService.getOrdersListByStatus("ready", callback);
        },
        function
    );
}

//
//async.forever(function(next) {
//    if (!autoAcknowledgeLoopStarted) {
//        var interval = AUTO_ACKNOWLEDGEMENT_INTERVAL_IF_FAILED;
//        autoAcknowledgeLoopStarted = true;
//        console.log("Acknowledgement job against Jet.com started. Next attempt in [%s] milliseconds"
//            .replace("%s", interval));
//        setTimeout(next, AUTO_ACKNOWLEDGEMENT_INTERVAL);
//    } else {
//        console.log("Attempting to re-auth against Jet.com.");
//        _connect(function(err, data) {
//            if (err) {
//                var interval = RECONNECT_INTERVAL_IF_FAILED;
//                _logRemoteError("Reconnect", err);
//                console.warn(
//                    "Re-auth attempt against Jet.com failed! Will keep retrying every [%i] milliseconds until successful, but if this keeps failing, the app WILL stop functioning."
//                        .replace("%s", interval)
//                );
//                setTimeout(next, interval);
//            } else {
//                var interval = RECONNECT_INTERVAL;
//                console.log("Re-auth attempt against Jet.com successful. Next attempt in [%s] milliseconds."
//                    .replace("%s", interval));
//                authData = data;
//                setTimeout(next, interval);
//            }
//        });
//    }
//});

