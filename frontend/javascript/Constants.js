var JET_ORDER_STATUS = require("jet-api").orders.ORDER_STATUS;
var JET_RETURN_STATUS = require("jet-api").returns.RETURN_STATUS;

var Constants = {
    POPOVER_TYPES: {
        ERROR: "error",
        SUCCESS: "success"
    },
    ORDER_STATUS: JET_ORDER_STATUS,
    RETURN_STATUS: JET_RETURN_STATUS
};

module.exports = Constants;