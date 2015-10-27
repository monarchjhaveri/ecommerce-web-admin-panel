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
  }
};

module.exports = helper;