var validator = require("validator");

//var minimally_valid_product = {
//    "product_title": "My Product",
//    "standard_product_codes": [
//        {
//            "standard_product_code": "123456789012",
//            "standard_product_code_type": "UPC"
//        }
//    ],
//    "multipack_quantity": 1
//};

var ProductValidationHelper = {};

ProductValidationHelper.validateProduct = function validateProduct(product) {
    return (
        product &&
        _validateProductTitle(product.product_title) &&
        _validateStandardProductCodeArray(product.standard_product_codes) &&
        _validateMultipackQuantity(product.multipack_quantity)
    );
};

ProductValidationHelper.validateProductTitle = _validateProductTitle;
ProductValidationHelper.validateStandardProductCodeArray = _validateStandardProductCodeArray;
ProductValidationHelper.validateMultipackQuantity = _validateMultipackQuantity;

function _validateMultipackQuantity(multipack_quantity) {
    return validator.isInt(multipack_quantity, {min: 1});
}

function _validateProductTitle(product_title) {
    return validator.isByteLength(product_title, 5, 500)
}

function _validateStandardProductCodeArray(spcArray) {
    if (spcArray instanceof Array && spcArray.length >= 1) {
        for (var i = 0; i < spcArray.length; i++) {
            if (!_validateStandardProductCode(spcArray[i])) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

function _validateStandardProductCode(spc) {
    return validator.equals(spc.standard_product_code_type, "UPC") &&
        validator.isByteLength(spc.standard_product_code, 12, 12);
}

module.exports = ProductValidationHelper;