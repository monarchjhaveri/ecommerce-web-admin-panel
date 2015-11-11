var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var PopoverAC = require("./PopoverAC");
var store = require("../store/store");

var MerchantAC = {
    getFulfillmentNodes: function () {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.MERCHANT.GET_FULFILLMENT_NODES_STARTED_SILENTLY
            });
            $.ajax({
                url: "api/merchant/fulfillmentnodes",
                error: function (request, error) {
                    dispatch({
                        type: ActionTypes.MERCHANT.GET_FULFILLMENT_NODES_FAILURE_SILENTLY,
                        payload: error
                    });
                    PopoverAC.displayError(request.responseText);
                },
                success: function (data) {
                    dispatch({
                        type: ActionTypes.MERCHANT.GET_FULFILLMENT_NODES_SUCCESS_SILENTLY,
                        payload: data
                    });
                }
            });
        });
    }
};

module.exports = MerchantAC;