var ActionTypes = require("./ActionTypes");

module.exports = {
    fetchAll: function() {
        return {
            type: ActionTypes.SKUS.FETCH_ALL,
            payload: [{
                "sku": "123"
            }]
        }
    }
};