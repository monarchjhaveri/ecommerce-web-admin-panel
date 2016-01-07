var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/s', function(req, res, next) {
  res.sendFile('index', { title: 'Express' });
});

/* GET packing slip */
router.get('/packingslip', function(req, res, next) {
  res.sendFile('packingslip', { title: 'Express' });
});

module.exports = router;
