var constants = require("./constants");
var browserify = require("browserify");
var watchify = require("watchify");
var fs = require('fs');
var sassRunnable = require("./runnables/sassRunnable");
var chokidar = require('chokidar');

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
//_runSass();

var watcher = chokidar.watch(constants.filepaths.scss.root, {
    persistent: true
});

log("Chokidar started.");

watcher.on('all', function(event, path) {
    log('File', path, 'has been changed');
    _runSass();
});

watcher.on('change', function(path, stats) {
    if (stats) console.log('File', path, 'changed size to', stats.size);
});

function _runSass() {
    console.log("Running sass.");
    sassRunnable.run();
}