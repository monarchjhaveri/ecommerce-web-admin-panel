var JET_ORDER_STATUS = {
    COMPLETE: "complete",
      IN_PROGRESS: "inprogress",
      ACKNOWLEDGED: "acknowledged",
      READY: "ready",
      CREATED: "created",
      DIRECTED_CANCEL: "directedCancel"
};

var JET_RETURN_STATUS = {
    JET_REFUNDED: "jetRefunded",
      COMPLETED_BY_MERCHANT: "completedByMerchant",
      REFUND_CUSTOMER_WITHOUT_RETURN: "refundCustomerWithoutReturn",
      ACKNOWLEDGED: "acknowledged",
      CREATED: "created"
};

var JET_REFUND_STATUS = {
    REJECTED_CUSTOMER_CARD_INVALID: "rejected - customer card not valid",
      REJECTED_CONFLICTS_WITH_RETURN_POLICY: "rejected - refund conflicts with returns policy",
      ACCEPTED: "accepted",
      PROCESSING: "processing",
      CREATED: "created"
};

var Constants = {
    POPOVER_TYPES: {
        ERROR: "error",
        SUCCESS: "success"
    },
    ORDER_STATUS: JET_ORDER_STATUS,
    RETURN_STATUS: JET_RETURN_STATUS,
    REFUND_STATUS: JET_REFUND_STATUS
};

module.exports = Constants;