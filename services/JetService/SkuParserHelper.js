var SKU_REGEX = /merchant.skus\/(.*)/;

var SkuParserHelper = {};

/**
 *
 * @param {!String} url
 * @returns {String}
 */
SkuParserHelper.extractSkuFromUrls = function(url) {
    if (typeof url.map === 'function') {
        return url.map(function(d){
            return _getSku(d);
        })
    } else {
        return _getSku(url);
    }
};

function _getSku(url) {
    var match = url.match(SKU_REGEX);
    if (match === null || match.length <= 1) {
        return null;
    } else {
        return match[1];
    }
}

module.exports = SkuParserHelper;
