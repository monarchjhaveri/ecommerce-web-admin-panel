var express = require('express');
var router = express.Router();
var MerchantResource = require("../resources/MerchantResource");

/* GET fulfillment nodes listing. */
router.get('/fulfillmentnodes', MerchantResource.getFulfillmentNodes);

module.exports = router;