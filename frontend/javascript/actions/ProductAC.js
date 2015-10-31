var ActionTypes = require("./ActionTypes");

module.exports = {
    fetchAll: function() {
        return {
            type: ActionTypes.PRODUCTS.FETCH_ALL,
            payload: [{
                "sku": "123"
            }]
        }
    }
};