/**
 * Created by monarch on 03/11/15.
 */
var ResourceErrorMessageHelper = {};

ResourceErrorMessageHelper.createErrorMessage = function(action, err) {
    return "Failed to %action: %errorMessage"
        .replace("%action", action)
        .replace("%errorMessage", err.message);
} ;

ResourceErrorMessageHelper.getAppropriateStatusCode = function(err) {
    return err.statusCode || 500;
};

module.exports = ResourceErrorMessageHelper;