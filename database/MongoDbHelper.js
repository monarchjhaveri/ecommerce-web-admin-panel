var mongoclient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;

var MongoDbHelper = {};

var mongoUrl = "mongodb://localhost:27017/ecommerceWebpanel";
var collectionName = "products";

/**
 *
 * @param options
 * @param callback
 */
MongoDbHelper.find = function(options, callback) {
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(collectionName).find(options).toArray(function(err, data){
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                        db.close();
                    }
                });
            }
        }
    );
};

/**
 *
 * @param productDto
 * @param callback
 */
MongoDbHelper.insert = function(productDto, callback) {
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(collectionName).insertOne(
                    productDto,
                    function(err, data){
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, data);
                            db.close();
                        }
                    }
                );
            }
        }
    );
};

MongoDbHelper.update = function(productDto, callback) {
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(collectionName).findOneAndUpdate({_id: productDto._id}, productDto, function(err, data){
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                        db.close();
                    }
                });
            }
        }
    );
};

/**
 *
 * @param productDto
 * @param callback
 */
MongoDbHelper.delete = function(productDto, callback) {
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(collectionName).deleteOne({_id: productDto._id}, function(err, data){
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                        db.close();
                    }
                });
            }
        }
    );
};

/**
 *
 * @param callback
 */
MongoDbHelper.getProductsList = function(callback) {
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(collectionName).find().toArray(function(err, data){
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data);
                        db.close();
                    }
                });
            }
        }
    );
};

module.exports = MongoDbHelper;