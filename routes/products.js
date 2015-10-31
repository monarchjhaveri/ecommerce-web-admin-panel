var express = require('express');
var router = express.Router();
var JetService = require('../services/JetService/JetService');

/* GET users listing. */
router.get('/', function(req, res, next) {
    JetService.listSkus()
        .then(_resolveSuccess(res), _throwError).catch(_throwError);
});

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