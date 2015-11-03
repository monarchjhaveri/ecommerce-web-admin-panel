var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

/*
{
    "ASIN":"TestTest10",
    "correlation_id":"map-5c7e058d28c041d2a93dbb51e27081e1",
    "inventory_by_fulfillment_node":[],
    "merchant_id":"c163f4f1379140d0982d18c443a1852f",
    "merchant_sku":"1",
    "merchant_sku_id":"c48056d95fe74dae81dc4667e247a1af",
    "multipack_quantity":10,
    "product_title":"Test Product",
    "sku_last_update":"2015-10-12T09:35:11.6347408+00:00",
    "status":"Processing",
    "sub_status":[]
}*/
//
//"standard_product_codes": [
//    {
//        "standard_product_code": "123456789012",
//        "standard_product_code_type": "UPC"
//    }
//],

var StandardProductCodeTypes = t.enums({
    "UPC": "UPC",
    "GTIN-14": "GTIN-14",
    "EAN": "EAN",
    "ISBN-10": "ISBN-10",
    "ISBN-13": "ISBN-13"
});

var StandardProductCode = t.subtype(t.struct({
    standard_product_code: t.Str,
    standard_product_code_type: StandardProductCodeTypes
}), function(spc) {
    var value = spc.standard_product_code;
    switch(spc.standard_product_code_type) {
        case "UPC":
            return value.length === 12;
        case "GTIN-14":
            return value.length === 14;
        case "EAN":
            return value.length === 13;
        case "ISBN-10":
            return value.length === 10;
        case "ISBN-13":
            return value.length === 13;
        default:
            return false;
    }
});

var ProductTitle = t.subtype(t.Str, function(str){
    return ProductValidationHelper.validateProductTitle(str)
});

var StandardProductCodeArray = t.subtype(t.list(StandardProductCode), function(list) {
    return list.length > 0;
});

var MultipackQuantity = t.subtype(t.Num, function(num){
    return num > 0;
});

var ProductModel = t.struct({
    _id: t.Str,
    merchant_sku: t.Str,
    product_title: ProductTitle,
    standard_product_codes: StandardProductCodeArray,
    multipack_quantity: MultipackQuantity
});



module.exports = ProductModel;