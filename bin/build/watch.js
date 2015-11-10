var constants = require("./constants");
var browserify = require("browserify");
var watchify = require("watchify");
var fs = require('fs');
var sassRunnable = require("./runnables/sassRunnable");
var chokidar = require('chokidar');
var colors = require('colors');

var b = browserify({
    entries: [constants.filepaths.javascript.entryFile],
    cache: {},
    packageCache: {},
    plugin: [watchify]
});
var watchifyBundle = b.transform("reactify");

b.on('update', function(updatedFiles, x) {
    console.log(colors.green(updatedFiles));
    bundle();
});

watchifyBundle.on('log', log);
bundle();

function bundle() {
    var writer = fs.createWriteStream(constants.filepaths.javascript.destinationFile);
    b.bundle()
        .on('error', function(message) {
            console.error(colors.red(message.message));
        })
        .pipe(writer);
}

function log(message) {
    console.log(message);
}

var scssWatcher = chokidar.watch(constants.filepaths.scss.root, {
    persistent: true
});

log("Chokidar started.");

scssWatcher.on('all', function(event, path) {
    console.log(colors.grey('File ' + path + ' has been changed'));
    _runSass();
});

scssWatcher.on('change', function(path, stats) {
    if (stats) console.log(colors.grey('File ' + path + ' changed size to ' + stats.size));
});

function _runSass() {
    sassRunnable.run();
}