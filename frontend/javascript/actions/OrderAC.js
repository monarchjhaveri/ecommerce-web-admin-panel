var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var PopoverAC = require("./PopoverAC");
var store = require("../store/store");
var pushState = require("redux-router").pushState;

var OrderAC = {
    setFilter: function(filterName) {
        store.dispatch(function(dispatch){
            dispatch({
                type: ActionTypes.ORDERS.SET_FILTER,
                payload: filterName
            });
        });
    },
    fetchAll: function(status) {
        OrderAC.clearSelection();
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.ORDERS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/orders/:status".replace(":status", status),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.ORDERS.FETCH_ALL_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.ORDERS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    /**
     *
     * @param merchant_order_id
     * @param acknowledgement_dto
     */
    acknowledge: function(merchant_order_id, acknowledgement_dto) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.ORDERS.ACKNOWLEDGE_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/orders/order/:merchant_order_id/acknowledge".replace(":merchant_order_id", merchant_order_id),
                contentType:'application/json',
                data: JSON.stringify(acknowledgement_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.ORDERS.ACKNOWLEDGE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    OrderAC.clearSelection();
                    dispatch({
                        type: ActionTypes.ORDERS.ACKNOWLEDGE_SUCCESS
                    });
                    PopoverAC.displaySuccessFromText("Successfully acknowledged order " + merchant_order_id +".");
                }
            });
        });
    },
    ship: function(merchant_order_id, shipment_dto) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.ORDERS.SHIP_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/orders/order/:merchant_order_id/shipped".replace(":merchant_order_id", merchant_order_id),
                contentType:'application/json',
                data: JSON.stringify(shipment_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.ORDERS.SHIP_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    OrderAC.clearSelection();
                    dispatch({
                        type: ActionTypes.ORDERS.SHIP_SUCCESS
                    });
                    PopoverAC.displaySuccessFromText("Successfully shipped order " + merchant_order_id + ".");
                }
            });
        });
    },
    getDetails: function(merchant_order_id) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.ORDERS.GET_DETAILS_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/orders/order/:merchant_order_id"
                    .replace(":merchant_order_id", merchant_order_id),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.ORDERS.GET_DETAILS_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.ORDERS.GET_DETAILS_SUCCESS,
                        payload: data
                    });
                    dispatch({
                        type: ActionTypes.ORDERS.SELECT,
                        payload: data
                    });
                }
            });
        });
    },
    /**
     *
     * @param order_id
     * @param refund_dto
     */
    refund: function(order_id, refund_dto) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.REFUNDS.COMPLETE_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/orders/order/:order_id/refund".replace(":order_id", order_id),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(refund_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.REFUNDS.COMPLETE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function() {
                    dispatch({
                        type: ActionTypes.REFUNDS.COMPLETE_SUCCESS
                    });
                }
            });
        });
    },
    openEditorToCreate: function() {
        store.dispatch({
            type: ActionTypes.ORDERS.SELECT,
            payload: {}
        });
    },
    clearSelection: function() {
        store.dispatch(pushState(null, "/orders"));
    }
};

function _displayError(request) {

}

module.exports = OrderAC;