module.exports = {
    /**
     *
     * @param {String[]} allowedArray
     */
  buildAllowExtensionRegex: function(allowedArray) {
        var regexFormat = ".*\\.(THE_PLACE_HOLDER)$";
        var a = allowedArray.join("|");
        var regexString = regexFormat.replace("THE_PLACE_HOLDER", a);
        return new RegExp(regexString);
  }
};