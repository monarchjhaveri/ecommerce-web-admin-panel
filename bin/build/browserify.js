var constants = require("./constants");
var browserify = require("browserify");

var fs = require('fs');

var writer = fs.createWriteStream(constants.filepaths.javascript.destinationFile);
var b = browserify();
b.add(constants.filepaths.javascript.entryFile);
b.bundle().pipe(writer);