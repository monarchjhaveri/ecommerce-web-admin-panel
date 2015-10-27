var fs = require('fs-extra');
var constants = require('./constants');
var helper = require("./_helper");

fs.remove(constants.filepaths.root.dest + "/*");
fs.outputFile(constants.filepaths.root.dest + "/.keep", "", helper.logError);