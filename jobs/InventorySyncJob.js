var JetService = require("../services/JetService/JetService");
var async = require("async");

var IDENTIFIER = "INVENTORY-SYNC-JOB-LOOP";

var queue = async.queue(function(datum, callback) {
	var merchant_sku = datum.merchant_sku;
	var deductible = datum.deductible;

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

				var inventoryLevelWasChanged = false;
				if (oldQuantity - deductible >= 0) {
					inventoryLevelWasChanged = true;
					payload.fulfillment_nodes[0].quantity = oldQuantity - deductible;
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

var MAX_INVENTORY_SYNC_JOB_DELAY = 2 * 1000;
var MIN_INVENTORY_SYNC_JOB_DELAY = 2 * 1000;

function generateDelay() {
	return _getRandomIntInclusive(MIN_INVENTORY_SYNC_JOB_DELAY, MAX_INVENTORY_SYNC_JOB_DELAY);
}

function _getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	/**
	 * Deduct inventory from merchant sku.
	 * @param merchant_sku
	 * @param deductible
     */
	deductInventory: function addToQueue(merchant_sku, deductible) {
		queue.push({merchant_sku: merchant_sku, deductible: deductible});
	}
};