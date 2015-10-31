var ActionTypes = require("./ActionTypes");

module.exports = {
    list: function() {
        return {
            type: ActionTypes.PRODUCTS.LIST
        }
    }
};