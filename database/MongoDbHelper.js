var mongoclient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;

var MongoDbHelper = {};

var mongoUrl = "mongodb://localhost:27017/ecommerceWebpanel";
var PRODUCTS_COLLECTION = "products";
var FILE_UPLOADS_COLLECTION = "fileUploads";

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
                db.collection(PRODUCTS_COLLECTION).find(options).toArray(function(err, data){
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
                db.collection(PRODUCTS_COLLECTION).insertOne(
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

MongoDbHelper.upsert = function(productDto, callback) {
    _update(productDto, callback, {upsert: true});
};

MongoDbHelper.update = function(productDto, callback) {
    _update(productDto, callback);
};

function _update(productDto, callback, _options) {
    var options = _options ? _options : {};
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(PRODUCTS_COLLECTION).findOneAndUpdate({merchant_sku: productDto.merchant_sku}, productDto, options, function(err, data){
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
}

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
                db.collection(PRODUCTS_COLLECTION).deleteOne({_id: productDto._id}, function(err, data){
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
                db.collection(PRODUCTS_COLLECTION).find().toArray(function(err, data){
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
 * @param fileUploadDto
 * @param callback
 */
MongoDbHelper.insertFileUploadObject = function(fileUploadDto, callback) {
    mongoclient.connect(mongoUrl,
        function(err, db){
            if (err){
                callback(err);
            } else {
                db.collection(FILE_UPLOADS_COLLECTION).insertOne(
                  fileUploadDto,
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

/**
 *
 * @param callback
 */
MongoDbHelper.getFileUploadList = function(callback) {
  mongoclient.connect(mongoUrl,
    function(err, db){
      if (err){
        callback(err);
      } else {
        db.collection(FILE_UPLOADS_COLLECTION).find().toArray(
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

module.exports = MongoDbHelper;