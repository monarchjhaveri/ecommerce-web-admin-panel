var JET_ORDER_STATUS = require("jet-api").orders.ORDER_STATUS;

var Constants = {
    POPOVER_TYPES: {
        ERROR: "error",
        SUCCESS: "success"
    },
    ORDER_STATUS: {
        ACKNOWLEDGED: JET_ORDER_STATUS.ACKNOWLEDGED,
        COMPLETE: JET_ORDER_STATUS.COMPLETE,
        IN_PROGRESS: JET_ORDER_STATUS.IN_PROGRESS,
        CREATED: JET_ORDER_STATUS.CREATED,
        READY: JET_ORDER_STATUS.READY
    }
};

module.exports = Constants;