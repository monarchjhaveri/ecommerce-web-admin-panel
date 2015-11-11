var express = require('express');
var router = express.Router();
var ProductsResource = require("../resources/ProductsResource");

/* GET products listing. */
router.get('/', ProductsResource.list);
router.get('/:sku', ProductsResource.find);
router.post('/', ProductsResource.createOrEdit);
router.put('/', ProductsResource.createOrEdit);
router.get('/:sku/inventory', ProductsResource.getInventory);

module.exports = router;