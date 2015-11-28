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
            enums[o.order_item_id] = o.product_title;
        }
        return enums;
    },
    getEnumsOfOrderItemSkusToProductTitles: function getEnumsOfOrderItemsToProductTitles(order) {
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
    },
    dateToJetDate: function dateToJetDate(value) {
        if (!value) return value;
        var dateString1 = new Date(value).toISOString();
        return dateString1.substring(0, dateString1.length-1) + "0000-05:00";
    }
};