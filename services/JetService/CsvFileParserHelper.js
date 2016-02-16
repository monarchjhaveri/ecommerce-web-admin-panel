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
            function(innerCallback) {
                fs.readFile(filepath, innerCallback);
            },
            function(fileContentString, innerCallback) {
                csv.parse(fileContentString, innerCallback);
            }
        ], callback);
    }
};

module.exports = CsvFileParserHelper;