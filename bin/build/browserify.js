var constants = require("./constants");
var browserify = require("browserify");
var watchify = require("watchify");
var fs = require('fs');

var b = browserify({
    entries: [constants.filepaths.javascript.entryFile],
    cache: {},
    packageCache: {},
    plugin: [watchify]
});
b.transform("reactify");

b.on('update', bundle);
b.on('log', log);
bundle();

function bundle() {
    var writer = fs.createWriteStream(constants.filepaths.javascript.destinationFile);
    b.bundle().pipe(writer);
}

function log(message) {
    console.log(message);
}
