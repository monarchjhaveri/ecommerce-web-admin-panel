var express = require('express');
var router = express.Router();
var ProductsResource = require("../resources/ProductsResource");

/* GET products listing. */
router.get('/', ProductsResource.list);
router.get('/:sku', ProductsResource.find);
router.post('/', ProductsResource.create);
router.put('/', ProductsResource.edit);
//router.delete('/:sku', ProductsResource.delete);

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