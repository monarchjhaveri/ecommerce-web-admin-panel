var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var PopoverAC = require("./PopoverAC");
var store = require("../store/store");

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
                dataType:'json',
                data: JSON.stringify(acknowledgement_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.ORDERS.ACKNOWLEDGE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.ORDERS.CLEAR_SELECTION
                    });
                    dispatch({
                        type: ActionTypes.ORDERS.ACKNOWLEDGE_SUCCESS
                    });
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
                dataType:'json',
                data: JSON.stringify(shipment_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.ORDERS.SHIP_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.ORDERS.CLEAR_SELECTION
                    });
                    dispatch({
                        type: ActionTypes.ORDERS.SHIP_SUCCESS
                    });
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
    openEditorToCreate: function() {
        store.dispatch({
            type: ActionTypes.ORDERS.SELECT,
            payload: {}
        });
    }
};

function _displayError(request) {

}

module.exports = OrderAC;