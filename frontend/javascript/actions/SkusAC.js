var ActionTypes = require("./ActionTypes");

module.exports = {
    fetchAll: function() {
        return function(dispatch) {
            setInterval(function() {
                dispatch({
                    type: ActionTypes.SKUS.FETCH_ALL,
                    payload: [{
                        "sku": "123"
                    }]
                });
            }, 2000)
        };
    }
};