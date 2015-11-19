module.exports = {
    getEnumsOfOrderItemsToProductTitles: function getEnumsOfOrderItemsToProductTitles(order) {
        var order_items;
        if (!order || !order.order_items) {
            order_items = [];
        } else {
            order_items = order.order_items;
        }
        var enums = {};
        for (var i = 0; i < order_items.length; i++) {
            var o = order_items[i];
            enums[o.merchant_sku] = o.product_title;
        }
        return enums;
    }
};