var fs = require('fs-extra');
var constants = require('./constants');

fs.remove(constants.filepaths.root.dest + "/*");
fs.outputFile(constants.filepaths.root.dest + "/.keep", "", function(err) {
    if (err) {
        console.log(err)
    }
});