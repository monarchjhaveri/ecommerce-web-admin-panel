var express = require('express');
var router = express.Router();
var TaxonomyResource = require("../resources/TaxonomyResource");

/* GET products listing. */
router.get('/nodes/:node_id', TaxonomyResource.getNodeAttributes);

module.exports = router;