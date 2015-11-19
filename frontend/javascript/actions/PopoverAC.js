var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var store = require("../store/store");

var ERROR_TIMEOUT = 10 * 1000; // 10 seconds

function _displayError(message) {
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
}


var PopoverAC = {
    displayError: function (request) {
        if (request.responseJSON) {
            var responseJSON = request.responseJSON;
            _displayError(responseJSON.message);
            if (responseJSON.errors) {
                for (var i = 0; i < responseJSON.errors.length; i++) {
                    _displayError(responseJSON.errors[i]);
                }
            }
        } else {
            _displayError(request.responseText);
        }
    },
    displayErrorFromText: _displayError,
    clearPopover: function (popoverId) {
        store.dispatch({
            type: ActionTypes.POPOVER.CLEAR_POPOVER,
            payload: popoverId
        });
    }
};

module.exports = PopoverAC;