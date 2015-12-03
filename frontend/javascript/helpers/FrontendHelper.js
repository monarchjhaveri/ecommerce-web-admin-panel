var moment = require("moment");

var FrontendHelper = {};

FrontendHelper.timestampToString = function timestampToString(timestamp) {
    if (!timestamp) return null;
    var m = moment(timestamp);
    if (!m.isValid()) {
        return timestamp;
    } else {
        return m.format('MMM Do [\']YY, h:mm:ss a');
    }
};

module.exports = FrontendHelper;