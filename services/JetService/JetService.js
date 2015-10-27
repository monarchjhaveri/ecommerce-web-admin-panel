var JetApi = require('jet-api');

var JetService = function() {
    this.jetConnection = null;
};

JetService.prototype.connect = function(user, secret) {
    this.jetConnection = JetApi.connect(user, secret);
};

module.exports = JetService;