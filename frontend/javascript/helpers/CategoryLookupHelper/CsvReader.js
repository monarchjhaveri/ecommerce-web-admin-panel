var fs = require("fs");

module.exports = {
    read: function(filename, callback) {

        //Converter Class
        var Converter = require("csvtojson").Converter;
        var converter = new Converter({});

        //end_parsed will be emitted once parsing finished
        converter.on("end_parsed", function (jsonArray) {
            callback(null, jsonArray);
        });

        //read from file
        require("fs").createReadStream(filename).pipe(converter);
    }
};