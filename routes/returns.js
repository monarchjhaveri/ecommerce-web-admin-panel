var express = require('express');
var router = express.Router();
var ReturnsResource = require("../resources/ReturnsResource");

/* GET products listing. */
router.get('/:return_status', ReturnsResource.list);
router.get('/return/:return_url_id', ReturnsResource.getDetails);
router.put('/return/:return_url_id/complete', ReturnsResource.complete);

module.exports = router;