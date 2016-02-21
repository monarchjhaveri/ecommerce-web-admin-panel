var fs = require('fs');
var csv = require('csv');
var async = require('async');

var CsvFileParserHelper = {
    /**
     *
     * @param {String} filepath
     * @param {Function} callback
     */
    convertFileToObject: function(filepath, callback) {
        async.waterfall([
            // read the file
            function(innerCallback) {
                fs.readFile(filepath, innerCallback);
            },
            // get the raw CSV array
            function(fileContentString, innerCallback) {
                csv.parse(fileContentString, innerCallback);
            },
            // turn it into an object, according to header definition
            function(csvArray, innerCallback) {

            }
        ], callback);
    }
};

module.exports = CsvFileParserHelper;