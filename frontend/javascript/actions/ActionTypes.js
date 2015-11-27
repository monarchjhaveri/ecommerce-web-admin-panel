var ActionTypes = {
    "PRODUCTS": {
        "FETCH_ALL_STARTED": "PRODUCTS.FETCH_ALL_STARTED",
        "FETCH_ALL_SUCCESS": "PRODUCTS.FETCH_ALL_SUCCESS",
        "FETCH_ALL_FAILURE": "PRODUCTS.FETCH_ALL_FAILURE",

        "GET_DETAILS_STARTED": "PRODUCTS.GET_DETAILS_STARTED",
        "GET_DETAILS_SUCCESS": "PRODUCTS.GET_DETAILS_SUCCESS",
        "GET_DETAILS_FAILURE": "PRODUCTS.GET_DETAILS_FAILURE",

        "EDIT_STARTED": "PRODUCTS.EDIT_STARTED",
        "EDIT_SUCCESS": "PRODUCTS.EDIT_SUCCESS",
        "EDIT_FAILURE": "PRODUCTS.EDIT_FAILURE",

        "CREATE_STARTED": "PRODUCTS.CREATE_STARTED",
        "CREATE_SUCCESS": "PRODUCTS.CREATE_SUCCESS",
        "CREATE_FAILURE": "PRODUCTS.CREATE_FAILURE",

        CLEAR_SELECTION: "CLEAR_SELECTION",
        "SELECT": "PRODUCTS.SELECT",

        INVENTORY: {
            "GET_STARTED": "PRODUCTS.INVENTORY.GET_STARTED",
            "GET_SUCCESS": "PRODUCTS.INVENTORY.GET_SUCCESS",
            "GET_FAILURE": "PRODUCTS.INVENTORY.GET_FAILURE",

            "EDIT_STARTED": "PRODUCTS.INVENTORY.EDIT_STARTED",
            "EDIT_SUCCESS": "PRODUCTS.INVENTORY.EDIT_SUCCESS",
            "EDIT_FAILURE": "PRODUCTS.INVENTORY.EDIT_FAILURE"
        },

        PRICE: {
            "GET_STARTED": "PRODUCTS.PRICE.GET_STARTED",
            "GET_SUCCESS": "PRODUCTS.PRICE.GET_SUCCESS",
            "GET_FAILURE": "PRODUCTS.PRICE.GET_FAILURE",

            "EDIT_STARTED": "PRODUCTS.PRICE.EDIT_STARTED",
            "EDIT_SUCCESS": "PRODUCTS.PRICE.EDIT_SUCCESS",
            "EDIT_FAILURE": "PRODUCTS.PRICE.EDIT_FAILURE"
        }
    },
    "ORDERS": {
        "FETCH_ALL_STARTED": "ORDERS.FETCH_ALL_STARTED",
        "FETCH_ALL_SUCCESS": "ORDERS.FETCH_ALL_SUCCESS",
        "FETCH_ALL_FAILURE": "ORDERS.FETCH_ALL_FAILURE",

        "GET_DETAILS_STARTED": "ORDERS.GET_DETAILS_STARTED",
        "GET_DETAILS_SUCCESS": "ORDERS.GET_DETAILS_SUCCESS",
        "GET_DETAILS_FAILURE": "ORDERS.GET_DETAILS_FAILURE",

        "ACKNOWLEDGE_STARTED": "ACKNOWLEDGE_STARTED",
        "ACKNOWLEDGE_SUCCESS": "ACKNOWLEDGE_SUCCESS",
        "ACKNOWLEDGE_FAILURE": "ACKNOWLEDGE_FAILURE",

        "SHIP_STARTED": "SHIP_STARTED",
        "SHIP_SUCCESS": "SHIP_SUCCESS",
        "SHIP_FAILURE": "SHIP_FAILURE",

        "SELECT": "ORDERS.SELECT",
        SET_FILTER: "ORDERS.SET_FILTER",
        "CLEAR_SELECTION": "ORDERS.CLEAR_SELECTION"
    },
    "RETURNS": {
        "FETCH_ALL_STARTED": "RETURNS.FETCH_ALL_STARTED",
        "FETCH_ALL_SUCCESS": "RETURNS.FETCH_ALL_SUCCESS",
        "FETCH_ALL_FAILURE": "RETURNS.FETCH_ALL_FAILURE",

        "GET_DETAILS_STARTED": "RETURNS.GET_DETAILS_STARTED",
        "GET_DETAILS_SUCCESS": "RETURNS.GET_DETAILS_SUCCESS",
        "GET_DETAILS_FAILURE": "RETURNS.GET_DETAILS_FAILURE",

        "SELECT": "RETURNS.SELECT",
        SET_FILTER: "RETURNS.SET_FILTER",
        "CLEAR_SELECTION": "RETURNS.CLEAR_SELECTION"
    },
    "POPOVER": {
        "DISPLAY_POPOVER": "POPOVER.DISPLAY_POPOVER",
        "CLEAR_POPOVER": "POPOVER.CLEAR_POPOVER"
    },
    MERCHANT: {
        "GET_FULFILLMENT_NODES_STARTED_SILENTLY": "MERCHANT.GET_FULFILLMENT_NODES_STARTED_SILENTLY",
        "GET_FULFILLMENT_NODES_SUCCESS_SILENTLY": "MERCHANT.GET_FULFILLMENT_NODES_SUCCESS_SILENTLY",
        "GET_FULFILLMENT_NODES_FAILURE_SILENTLY": "MERCHANT.GET_FULFILLMENT_NODES_FAILURE_SILENTLY"
    }
};

module.exports = ActionTypes;