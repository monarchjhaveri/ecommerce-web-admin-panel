var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var store = require("../store/store");

var POPOVER_TIMEOUT = 10 * 1000; // 10 seconds

function _makePopover(message, type) {
    store.dispatch(function (dispatch) {
        var popoverId = Math.random();
        dispatch({
            type: ActionTypes.POPOVER.DISPLAY_POPOVER,
            payload: {
                popoverId: popoverId,
                type: type,
                message: message
            }
        });
        setTimeout(function () {
            PopoverAC.clearPopover(popoverId);
        }, POPOVER_TIMEOUT);
    });
}

function _displayError(message) {
    _makePopover(message, Constants.POPOVER_TYPES.ERROR);
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
    displaySuccessFromText: function(message) {
        _makePopover(message, Constants.POPOVER_TYPES.SUCCESS);
    },
    clearPopover: function (popoverId) {
        store.dispatch({
            type: ActionTypes.POPOVER.CLEAR_POPOVER,
            payload: popoverId
        });
    }
};

module.exports = PopoverAC;