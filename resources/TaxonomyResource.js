var JetService = require("../services/JetService/JetService");
var async = require("async");

var createErrorMessage = require("./ResourceErrorMessageHelper").createErrorMessage;
var getAppropriateStatusCode = require("./ResourceErrorMessageHelper").getAppropriateStatusCode;

var TaxonomyResource = {};

TaxonomyResource.getNodeAttributes = function(req, res, next) {
    var node_id = req.params.node_id;
    async.waterfall([
        function(callback) {
            JetService.getNodeAttributes(node_id, callback);
        }
    ], _responseFunctionFactory("get node attributes", res));
};

function _responseFunctionFactory(action, res) {
    return function(err, data) {
        if (err) {
            console.log(err);
            res.status(getAppropriateStatusCode(err)).send(createErrorMessage(action, err));
        } else {
            res.send(data);
        }
    }
}



module.exports = TaxonomyResource;