var JetService = require("../services/JetService/JetService");
var async = require("async");

var IDENTIFIER = "INVENTORY-SYNC-JOB-LOOP";

var queue = async.queue(function(datum, callback) {
	var merchant_sku = datum.merchant_sku;
	var adjustable = datum.adjustable;

	if (!JetService.isLoggedIn()) {
		setTimeout(function() {
			callback();
		}, 1000);
	} else {
		async.waterfall([
			function(callback) {
				JetService.getProductInventory(merchant_sku, callback);
			},
			function(productInventory, callback) {
				var inventoryLevelWasChanged;

				if (productInventory && productInventory.fulfillment_nodes && productInventory.fulfillment_nodes[0] && productInventory.fulfillment_nodes[0].quantity) {
					var oldQuantity = productInventory.fulfillment_nodes && productInventory.fulfillment_nodes[0] && productInventory.fulfillment_nodes[0].quantity;

					if (oldQuantity !== 0 && !oldQuantity) {
						console.log(IDENTIFIER + ": product inventory JSON for merchant sku [" + merchant_sku + "] was malformed or unrecognized. JSON is below.");
						console.log(productInventory);
						callback(new Error(IDENTIFIER + ": JSON received for Product inventory details was malformed or unrecognized. See above for JSON."));
					}

					var payload = {
						"fulfillment_nodes": [
							{
								"fulfillment_node_id": productInventory.fulfillment_nodes[0].fulfillment_node_id,
								"quantity": productInventory.fulfillment_nodes[0].quantity
							}
						]
					};

					inventoryLevelWasChanged = false;
					if (oldQuantity + adjustable >= 0) {
						inventoryLevelWasChanged = true;
						payload.fulfillment_nodes[0].quantity = oldQuantity + adjustable;
					}
				}

				setTimeout(function() {
					if (inventoryLevelWasChanged) {
						JetService.updateProductInventory(payload, merchant_sku, callback);
					} else {
						callback();
					}
				}, generateDelay());
			}
		], function(err, data) {
			if (err) {
				console.log(IDENTIFIER + ": WARNING: INVENTORY SYNC FOR MERCHANT SKU [" + merchant_sku + "]  DID NOT WORK!! TRYING AGAIN SOON, STACK TRACE BELOW!");
				callback();
			} else {
				console.log(IDENTIFIER + ": Successfully synced inventory for merchant sku [" + merchant_sku + "].");
				callback();
			}
		});
	}
}, 1);

var getAdjustableFromOrderQueue = async.queue(function(datum, queueCallback) {
	var merchant_order_id = datum.merchant_order_id;

	if (!JetService.isLoggedIn()) {
		setTimeout(function() {
			queueCallback();
		}, 1000);
	} else {
		async.waterfall([
			function(callback) {
				JetService.getOrderDetails(merchant_order_id, callback);
			},
			function (orderDetails, callback) {
				orderDetails.order_items.forEach(function(orderItem) {
					adjustInventory(orderItem.merchant_sku, -(orderItem.request_order_quantity));
				});
				callback();
			}
		], function(err, data) {
			if (err) {
				console.log(IDENTIFIER + ": WARNING: adjustInventoryAccordingToOrder for [" + merchant_order_id + "]  DID NOT WORK!! It will have to be manually adjusted.");
				console.error(err);
			}
			queueCallback();
		})
	}
}, 1);

var MAX_INVENTORY_SYNC_JOB_DELAY = 2 * 1000;
var MIN_INVENTORY_SYNC_JOB_DELAY = 2 * 1000;

function generateDelay() {
	return _getRandomIntInclusive(MIN_INVENTORY_SYNC_JOB_DELAY, MAX_INVENTORY_SYNC_JOB_DELAY);
}

function _getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param merchant_sku
 * @param adjustable
 */
function adjustInventory(merchant_sku, adjustable) {
	queue.push({merchant_sku: merchant_sku, adjustable: adjustable});
}

/**
 *
 * @param merchant_order_id
 */
function adjustInventoryAccordingToOrder(merchant_order_id) {
	getAdjustableFromOrderQueue.push({merchant_order_id: merchant_order_id});
}

module.exports = {
	adjustInventory: adjustInventory,
	adjustInventoryAccordingToOrder: adjustInventoryAccordingToOrder
};