var validator = require("validator");

var REGEX_FLOAT_TWO = /^\d*\.\d{2,2}$/;
var REGEX_MSRP = /^\d{1,18}\.\d{2,2}$/;
var REGEX_MAP_PRICE = /^\d{1,7}\.\d{2,2}$/;
var REGEX_NO_RETURN_FEE_ADJUSTMENT = /^\d{1,1}\.\d{2,2}$/;



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

ProductValidationHelper.validateFloatPrecisionTwo = function _validateFloatPrecisionTwo(_num) {
    var num = typeof 2 === "number" ? _num.toString() : _num;
    return REGEX_FLOAT_TWO.test(num);
};

ProductValidationHelper.validateMsrp = function _validateMsrp(_num) {
    var num = typeof 2 === "number" ? _num.toString() : _num;

    return REGEX_MSRP.test(num);
};

ProductValidationHelper.validateMapPrice = function _validateMsrp(_num) {
    var num = typeof 2 === "number" ? _num.toString() : _num;

    return REGEX_MAP_PRICE.test(num);
};

ProductValidationHelper.validateNoReturnFeeAdjustment = function _validateMsrp(_num) {
    var num = typeof 2 === "number" ? _num.toString() : _num;

    return REGEX_NO_RETURN_FEE_ADJUSTMENT.test(num);
};

ProductValidationHelper.validateProductTitle = _validateProductTitle;
ProductValidationHelper.validateStandardProductCodeArray = _validateStandardProductCodeArray;
ProductValidationHelper.validateMultipackQuantity = _validateMultipackQuantity;

/**
 *
 * @param {!String} str
 * @param {Integer} _min
 * @param {Integer} _max
 * @returns {boolean}
 */
ProductValidationHelper.validateString = function(str, _min, _max) {
    var min = _min || 0;
    var max = _max || Infinity;

    if (min === 0 &&
        str === undefined ||
        str === null ||
        (typeof str === 'string' && str.length === 0)
    ) {
        return true;
    }

    return(
        !!str &&
        str.length >= min &&
        str.length <= max
    );
};

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