var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var FileUploadResource = require("../resources/FileUploadResource");

/* GET products listing. */
router.post('/', upload.single('file'), FileUploadResource.uploadFile);
router.get('/', FileUploadResource.getUploadsList);
router.get('/:jet_file_id', FileUploadResource.getUploadDetails);

module.exports = router;