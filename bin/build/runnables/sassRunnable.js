var constants = require("../constants");
var sass = require('node-sass');
var fs = require("fs");

var SOURCE = constants.filepaths.scss.src;
var DESTINATION = constants.filepaths.scss.dest;

module.exports.run = function run() {
    sass.render({
        file: SOURCE
    }, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            fs.writeFile(DESTINATION, result.css, function(err2){
                if(err2){
                    console.error(err2);
                } else {
                    // file written to disk.
                }
            });
        }
    });
};
