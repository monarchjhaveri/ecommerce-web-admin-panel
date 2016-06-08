var JetService = require("../services/JetService/JetService");
var async = require("async");

var queue = async.queue(function(datum, callback) {
	var merchant_order_id = datum.merchant_order_id;
	if (!JetService.isLoggedIn()) {
		setTimeout(function() {
			callback();
		}, 1000);
	} else {
		async.waterfall([
			function(callback) {
				JetService.getOrderDetails(merchant_order_id, callback);
			},
			function(orderDetails, callback) {
				var acknowledgementBody = {
				  "acknowledgement_status": "accepted",
				  "order_items": orderDetails.order_items.map(function(d) {
				    return {
				      "order_item_acknowledgement_status": "fulfillable",
				      "order_item_id": d.order_item_id
				    };
				  })
				};
				setTimeout(function() {
					JetService.acknowledgeOrder(acknowledgementBody, merchant_order_id, callback);
				}, generateAcknowledgeOrderDelay());
			}
		], function(err, data) {
			if (err) {
				logError("QUEUE: WARNING: AUTO-ACKNOWLEDGMENT DID NOT WORK!! TRYING AGAIN SOON, STACK TRACE BELOW!", err);
				callback();
			} else {
				logMessage("Successfully acknowledged order " + merchant_order_id);
				callback();
			}
		});
	}
}, 1);

async.forever(function(next) {
	JetService.getOrdersListByStatus("ready", function(err, data) {
		if (!queue.idle()) {
			logMessage("AUTO-ACKNOWLEDGE-QUERY-LOOP:  Queue is still processing items. Skipping query until queue is empty.");
		} else if (err) {
			logError("AUTO-ACKNOWLEDGE-QUERY-LOOP: AN ERROR OCCURRED!! TRYING AGAIN SOON, STACK TRACE BELOW!", err);
		} else {
			queue.push(data);
			logMessage("AUTO-ACKNOWLEDGE-QUERY-LOOP: Successfully pushed " +  data.length + " items to the queue.");
		}
		setTimeout(next, generateGetOrdersListDelay());
	});
});

var MIN_LIST_DELAY = 3 * 60 * 1000;
var MAX_LIST_DELAY = 1 * 60 * 1000;
var MAX_ACKNOWLEDGE_ORDER_DELAY = 10 * 1000;
var MIN_ACKNOWLEDGE_ORDER_DELAY = 3 * 1000;

function generateGetOrdersListDelay() {
	return _getRandomIntInclusive(MIN_LIST_DELAY, MAX_LIST_DELAY);
}

function generateAcknowledgeOrderDelay() {
	return _getRandomIntInclusive(MIN_ACKNOWLEDGE_ORDER_DELAY, MAX_ACKNOWLEDGE_ORDER_DELAY);
}

function _getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logMessage(message) {
	console.log(getDateString(), message);
}

function logError(message, err) {
	console.error(getDateString(), message, err);
}

function getDateString() {
	var rightNow = new Date();
	return rightNow.toISOString()
}