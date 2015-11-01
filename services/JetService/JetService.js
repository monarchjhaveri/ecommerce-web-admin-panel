var SkuParserHelper = require("./SkuParserHelper");
var JetApi = require('jet-api');

var user = null;
var pass = null;
var authData = null;

var authenticationError = null;

var JetService = {};

JetService.connect = function(_user, _pass) {
    JetApi.authentication.connect(_user, _pass, function(err, data) {
        if (err) {
            throw (err);
        }

        user = _user;
        pass = _pass;
        authData = data;
    });
};

JetService.getAllSkus = function(callback) {
    if (notLoggedIn("getAllSkus", callback)) return;
    JetApi.products.list(authData.id_token, function(listErr, listData){
        if (listErr || !listData || !listData.sku_urls) {
            console.error(listErr);
            callback(new Error("Failed to get list of SKU's from Jet.com API"));
        }

        callback(null, SkuParserHelper.extractSkuFromUrls(listData.sku_urls));
    });
};

/**
 *
 * @param {!String} actionName
 * @param {!String} callback
 * @returns {boolean}
 */
function notLoggedIn(actionName, callback) {
    if (!authData || !authData.id_token) {
        console.error(
            "Tried to do this action: [%s]. But, not backend client is not logged in to Jet.com!"
                .replace("%s", actionName)
        );
        callback(new Error("Not connected to Jet.com!"));
        return true;
    }
    return false;
}


module.exports = JetService;