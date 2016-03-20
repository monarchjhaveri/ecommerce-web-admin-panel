var fs = require('fs');
var csv = require('csv');
var csvObjects = require('csv-objects');
var async = require('async');
var zlib = require('zlib');

var CsvFileParserHelper = {
    /**
     * Converts a filepath into a gzip string
     * @param {String} filepath
     * @param {Function} callback
     */
    convertFileToObjectGzip: function(filepath, callback) {
        async.waterfall([
            // read the file
            function(innerCallback) {
                fs.readFile(filepath, innerCallback);
            },
            // parse the CSV String into a JSON array or object
            function(fileContentString, innerCallback) {
                csvObjects.parse(fileContentString, innerCallback);
            },
            // gzip the JSON object and return a string
            function(fileObject, callback) {
                zlib.deflate(JSON.stringify(fileObject), callback);
            }
        ], callback);
    }
};

module.exports = CsvFileParserHelper;