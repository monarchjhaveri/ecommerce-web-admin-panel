var express = require('express');
var router = express.Router();
var OrdersResource = require("../resources/OrdersResource");
var RefundsResource = require("../resources/RefundsResource");

/* GET products listing. */
router.get('/:order_status', OrdersResource.list);
router.get('/order/:merchant_order_id', OrdersResource.getDetails);
router.put('/order/:merchant_order_id/acknowledge', OrdersResource.acknowledge);
router.put('/order/:merchant_order_id/shipped', OrdersResource.shipped);
router.put('/order/:merchant_order_id/refund', OrdersResource.refund);
//router.get('/:merchant_order_id', OrdersResource.find);

module.exports = router;