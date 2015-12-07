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
     * @param return_url_id
     * @param return_complete_dto
     */
    complete: function(return_url_id, return_complete_dto) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.RETURNS.COMPLETE_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/returns/return/:return_url_id/complete".replace(":return_url_id", return_url_id),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(return_complete_dto),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.RETURNS.COMPLETE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function() {
                    ReturnAC.clearSelection();
                    dispatch({
                        type: ActionTypes.RETURNS.COMPLETE_SUCCESS
                    });
                }
            });
        });
    },
    getDetails: function(return_url_id) {
        store.dispatch(function(dispatch) {
            dispatch({
                type: ActionTypes.RETURNS.GET_DETAILS_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/returns/return/:return_url_id"
                    .replace(":return_url_id", return_url_id),
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
    clearSelection: function() {
        store.dispatch(pushState(null, "/returns"));
    }
};

module.exports = ReturnAC;