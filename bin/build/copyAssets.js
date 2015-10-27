var constants = require("./constants");
var ncp = require('ncp').ncp;
var helper = require('./_helper');

var BLACKLISTED_FILETYPES = ["js", "jsx"];
var options = {
    filter: helper.buildBlacklistedFiletypeRegex(BLACKLISTED_FILETYPES)
};

ncp(constants.filepaths.root.src, constants.filepaths.root.dest, options, helper.logError);