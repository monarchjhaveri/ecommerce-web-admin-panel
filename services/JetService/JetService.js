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

JetService.getProductsList = function(callback) {
    if (notLoggedIn("getProductsList", callback)) return;
    JetApi.products.list(authData.id_token, function(listErr, listData){
        if (listErr || !listData || !listData.sku_urls) {
            console.error(listErr);
            callback(new Error("Failed to get list of SKU's from Jet.com API"));
        }

        var skus = SkuParserHelper.extractSkuFromUrls(listData.sku_urls);

        var products = skus.map(function(d) {
            return {
                sku: d
            }
        });

        callback(null, products);
    });
};

JetService.getDetails = function(sku, callback) {

    if (notLoggedIn("getDetails", callback)) return;

    JetApi.products.getDetails(sku, authData.id_token, function(getDetailsErr, data){
        if (getDetailsErr) {
            console.error(getDetailsErr);
            callback(new Error("Failed to get list of SKU's from Jet.com API"));
        }

        callback(null, data);
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