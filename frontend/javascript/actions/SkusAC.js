var $ = require("jquery");
var ActionTypes = require("./ActionTypes");

module.exports = {
    fetchAll: function() {
        return function(dispatch) {
            dispatch({
                type: ActionTypes.SKUS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/products",
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.SKUS.FETCH_ALL_FAILURE
                    });
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.SKUS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        };
    },
    getDetails: function(sku) {
        return function(dispatch) {
            dispatch({
                type: ActionTypes.SKUS.GET_DETAILS_STARTED
            });

        }
    }
};