var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var store = require("../store/store");

var ERROR_TIMEOUT = 10 * 1000; // 10 seconds

var PopoverAC = {
    displayError: function (message) {
        store.dispatch(function (dispatch) {
            var popoverId = Math.random();
            dispatch({
                type: ActionTypes.POPOVER.DISPLAY_POPOVER,
                payload: {
                    popoverId: popoverId,
                    type: Constants.POPOVER_TYPES.ERROR,
                    message: message
                }
            });
            setTimeout(function () {
                PopoverAC.clearPopover(popoverId);
            }, ERROR_TIMEOUT);
        });
    },
    clearPopover: function (popoverId) {
        store.dispatch({
            type: ActionTypes.POPOVER.CLEAR_POPOVER,
            payload: popoverId
        });
    }
};

module.exports = PopoverAC;