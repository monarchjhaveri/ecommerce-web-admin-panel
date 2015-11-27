var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var PopoverAC = require("./PopoverAC");
var store = require("../store/store");
var pushState = require("redux-router").pushState;

var ReturnAC = {
    setFilter: function(filterName) {
        store.dispatch(function(dispatch){
            dispatch({
                type: ActionTypes.RETURNS.SET_FILTER,
                payload: filterName
            });
        });
    },
    fetchAll: function(status) {
        ReturnAC.clearSelection();
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.RETURNS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/returns/:status".replace(":status", status),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.RETURNS.FETCH_ALL_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.RETURNS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    /**
     *
     * @param merchant_return_authorization_id
     * @param acknowledgement_dto
     */
    acknowledge: function(merchant_return_authorization_id, acknowledgement_dto) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.RETURNS.ACKNOWLEDGE_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/returns/return/:merchant_return_authorization_id/acknowledge".replace(":merchant_return_authorization_id", merchant_return_authorization_id),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(acknowledgement_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.RETURNS.ACKNOWLEDGE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    ReturnAC.clearSelection();
                    dispatch({
                        type: ActionTypes.RETURNS.ACKNOWLEDGE_SUCCESS
                    });
                }
            });
        });
    },
    ship: function(merchant_order_id, shipment_dto) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.RETURNS.SHIP_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/orders/order/:merchant_order_id/shipped".replace(":merchant_order_id", merchant_order_id),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(shipment_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.RETURNS.SHIP_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    ReturnAC.clearSelection();
                    dispatch({
                        type: ActionTypes.RETURNS.SHIP_SUCCESS
                    });
                }
            });
        });
    },
    getDetails: function(merchant_order_id) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.RETURNS.GET_DETAILS_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/orders/order/:merchant_order_id"
                    .replace(":merchant_order_id", merchant_order_id),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.RETURNS.GET_DETAILS_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.RETURNS.GET_DETAILS_SUCCESS,
                        payload: data
                    });
                    dispatch({
                        type: ActionTypes.RETURNS.SELECT,
                        payload: data
                    });
                }
            });
        });
    },
    openEditorToCreate: function() {
        store.dispatch({
            type: ActionTypes.RETURNS.SELECT,
            payload: {}
        });
    },
    clearSelection: function() {
        store.dispatch(pushState(null, "/returns"));
    }
};

function _displayError(request) {

}

module.exports = ReturnAC;