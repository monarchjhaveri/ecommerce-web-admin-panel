var helper = {
    /**
     *
     * @param {String[]} _blacklistedArray
     */
    buildBlacklistedFiletypeRegex: function(_blacklistedArray) {
        var blacklistedArray = _blacklistedArray instanceof Array ? _blacklistedArray : [_blacklistedArray];

        var regexFormat = "^[^.]+$|\\.(?!(THE_PLACE_HOLDER)$)([^.]+$)";
        var a = blacklistedArray.join("|");
        var regexString = regexFormat.replace("THE_PLACE_HOLDER", a);
        return new RegExp(regexString);
    },
    logError: function(err) {
        if (err) {
            return console.log("An error occurred during the build.", err);
        }
    }
};

module.exports = helper;