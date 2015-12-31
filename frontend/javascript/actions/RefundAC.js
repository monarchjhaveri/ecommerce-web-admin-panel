var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var PopoverAC = require("./PopoverAC");
var store = require("../store/store");
var pushState = require("redux-router").pushState;

var RefundAC = {
    setFilter: function(filterName) {
        store.dispatch(function(dispatch){
            dispatch({
                type: ActionTypes.REFUNDS.SET_FILTER,
                payload: filterName
            });
        });
    },
    fetchAll: function(status) {
        RefundAC.clearSelection();
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.REFUNDS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/refunds/:status".replace(":status", status),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.REFUNDS.FETCH_ALL_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.REFUNDS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    ///**
    // *
    // * @param refund_url_id
    // * @param refund_complete_dto
    // */
    //complete: function(refund_url_id, refund_complete_dto) {
    //    store.dispatch(function(dispatch) {
    //        dispatch({
    //            type: ActionTypes.REFUNDS.COMPLETE_STARTED
    //        });
    //        $.ajax({
    //            method: "PUT",
    //            url: "api/refunds/refund/:refund_url_id/complete".replace(":refund_url_id", refund_url_id),
    //            contentType:'application/json',
    //            dataType:'json',
    //            data: JSON.stringify(refund_complete_dto),
    //            error: function(request, error) {
    //                dispatch({
    //                    type: ActionTypes.REFUNDS.COMPLETE_FAILURE,
    //                    payload: error
    //                });
    //                PopoverAC.displayError(request);
    //            },
    //            success: function() {
    //                RefundAC.clearSelection();
    //                dispatch({
    //                    type: ActionTypes.REFUNDS.COMPLETE_SUCCESS
    //                });
    //            }
    //        });
    //    });
    //},
    getDetails: function(refund_url_id) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.REFUNDS.GET_DETAILS_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/refunds/refund/:refund_url_id"
                    .replace(":refund_url_id", refund_url_id),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.REFUNDS.GET_DETAILS_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.REFUNDS.GET_DETAILS_SUCCESS,
                        payload: data
                    });
                    dispatch({
                        type: ActionTypes.REFUNDS.SELECT,
                        payload: data
                    });
                }
            });
        });
    },
    clearSelection: function() {
        store.dispatch(pushState(null, "/refunds"));
    }
};

module.exports = RefundAC;