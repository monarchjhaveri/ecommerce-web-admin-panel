var express = require('express');
var router = express.Router();
var OrdersResource = require("../resources/OrdersResource");

/* GET products listing. */
router.get('/:order_status', OrdersResource.list);
router.get('/order/:merchant_order_id', OrdersResource.getDetails);
router.put('/order/:merchant_order_id/acknowledge', OrdersResource.acknowledge);
//router.get('/:merchant_order_id', OrdersResource.find);

module.exports = router;