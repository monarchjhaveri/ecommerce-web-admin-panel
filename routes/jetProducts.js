var express = require('express');
var router = express.Router();
var ProductsResource = require("../resources/JetProductsResource");
var JetService = require('../services/JetService/JetService');

/* GET products listing. */
router.get('/', ProductsResource.getProductsList);
router.get('/:sku', ProductsResource.getDetails);
//router.post('/:sku', ProductsResource.create);

module.exports = router;