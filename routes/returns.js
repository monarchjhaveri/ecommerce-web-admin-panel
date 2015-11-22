var express = require('express');
var router = express.Router();
var ReturnsResource = require("../resources/ReturnsResource");

/* GET products listing. */
router.get('/:return_status', ReturnsResource.list);
router.get('/order/:return_id', ReturnsResource.getDetails);
router.put('/order/:return_id/complete', ReturnsResource.complete);

module.exports = router;