var express = require('express');
var router = express.Router();
var ProductsResource = require("../resources/Products");
var JetService = require('../services/JetService/JetService');

/* GET products listing. */
router.get('/', ProductsResource.getAllSkus);
router.get('/:sku', ProductsResource.getDetails);

module.exports = router;

function _sendData(data, res) {
    res.send(data);
}

function _resolveSuccess(res) {
    return function(data) {
        res.send(data);
    }
}

function _throwError() {
    throw new Error()
}