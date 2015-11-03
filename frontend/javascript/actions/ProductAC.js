var $ = require("jquery");
var ActionTypes = require("./ActionTypes");

module.exports = {
    fetchAll: function() {
        return function(dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/products",
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_FAILURE
                    });
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        };
    },
    //getDetails: function(sku) {
    //    return function(dispatch) {
    //        dispatch({
    //            type: ActionTypes.PRODUCTS.GET_DETAILS_STARTED
    //        });
    //        $.ajax({
    //            url: "api/products/:sku".replace(":sku", sku),
    //            error: function(request, error) {
    //                dispatch({
    //                    type: ActionTypes.PRODUCTS.GET_DETAILS_FAILURE
    //                });
    //            },
    //            success: function(data) {
    //                dispatch({
    //                    type: ActionTypes.PRODUCTS.GET_DETAILS_SUCCESS,
    //                    payload: data
    //                });
    //            }
    //        });
    //    }
    //},
    select: function(product) {
        return {
            type: ActionTypes.PRODUCTS.SELECT,
            payload: product
        }
    }
};