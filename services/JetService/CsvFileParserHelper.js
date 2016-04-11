var fs = require('fs');
var csv = require('csv');
var csvObjects = require('csv-objects');
var async = require('async');
var zlib = require('zlib');
var uuid = require('uuid');
var path = require('path');

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
                csvObjects.parse(fileContentString.toString(), innerCallback);
            },
            // convert the array of objects into a hashmap keyed by sku
            function(fileObject, callback) {
              var objectData = {};
              fileObject.forEach(function (obj) {
                  var key = Object.keys(obj)[0]; // get the key
                  if (objectData[key]) throw Error("Key [" + key + "] was defined twice!");
                  objectData[key] = obj[key]; // set the data value against the key.
              });
              callback(null, objectData);
            },
            // gzip the JSON object and return a string
            function(fileObject, callback) {
                zlib.gzip(JSON.stringify(fileObject), callback);
            },
          // write the data to a file
          function(gzippedData, callback) {
          var filename = '/tmp/' + uuid.v4() + '.json.gz';
            fs.writeFile(filename, gzippedData, function(err, data) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, filename)
                }
            });
          },
          // send back the read data
          function(filename, callback) {
              fs.readFile(filename, callback);
          }
        ], callback);
    }
};

module.exports = CsvFileParserHelper;