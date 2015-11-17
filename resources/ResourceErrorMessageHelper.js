/**
 * Created by monarch on 03/11/15.
 */
var ResourceErrorMessageHelper = {};

ResourceErrorMessageHelper.createErrorMessage = function(action, err) {
    var errors;
    try {
        errors = JSON.parse(err.extras);
    } catch (e) {
        errors = err.extras;
    }

    var message = {};
    message.message = "Failed to %action.".replace("%action", action);
    message.errors = (errors && errors.errors) ? errors.errors : errors;
    return message;
};

ResourceErrorMessageHelper.getAppropriateStatusCode = function(err) {
    return err.statusCode || 500;
};

module.exports = ResourceErrorMessageHelper;