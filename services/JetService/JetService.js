var JetApi = require('jet-api');

var JetService = function() {
    this.jetConnection = null;
};

JetService.prototype.connect = function(user, secret) {
    this.jetConnection = JetApi.connect(user, secret);
};

JetService.prototype.listSkus = function() {
    if (!this.jetConnection) return;

    return this.jetConnection.Products.listProductSkus();
};

var jetService = new JetService();

module.exports = jetService;

function _generateRejection(options, reject) {
    reject(options);
}