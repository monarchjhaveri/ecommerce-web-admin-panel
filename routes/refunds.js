var express = require('express');
var router = express.Router();
var RefundsResource = require("../resources/RefundsResource");

/* GET products listing. */
router.get('/:refund_status', RefundsResource.list);
router.get('/refund/:refund_url_id', RefundsResource.getDetails);

module.exports = router;