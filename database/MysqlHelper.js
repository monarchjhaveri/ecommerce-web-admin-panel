var mysql = require("mysql");

var MysqlHelper = {};

var CREATE_PRODUCT = "INSERT INTO products (sku) VALUES ?";


MysqlHelper.createProducts = function(_products, callback) {
    var products = _products instanceof Array ? _products : [_products];

    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if (!p) {
            callback(new Error("Query preparation failed: Invalid entry found for product!"));
            return;
        }
        if (!p.sku) {
            callback(new Error("Query preparation failed: Product must include SKU!"));
            return;
        }
    }

    // Create arrays for INSERT statement. As a nice benefit, this also filters out values which are unexpected.
    products = products.map(function(d) {
        return [d.sku];
    });


    _doQuery(CREATE_PRODUCT, products, callback);
};


function _doQuery(query, params, callback) {
    var options = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    };

    var connection = mysql.createConnection(options);

     connection.query(query, params, function(queryErr, queryData) {
        connection.end(function(endErr) {
            if (endErr) {
                console.error(endErr);
                connection.destroy();
            }
        });

        callback(queryErr, queryData);
    });

}

module.exports = MysqlHelper;