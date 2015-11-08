var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");

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

var Bullets = t.subtype(t.list, function(ls) {
    if (!ls) {
        return false;
    }

    if (ls.length > 5) {
        return false;
    }

    var valid = true;
    for (var i = 0; i < ls.length; i++) {
        valid = ProductValidationHelper.validateString(ls, 0, 500);
        if (!valid) break;
    }

    return valid;
});

var FloatPrecisionTwo = t.refinement(t.Number, ProductValidationHelper.validateFloatPrecisionTwo);

// unused fields
/*
 * jet_browse_node_id
 * amazon_item_type_keyword
 * category_path
 *
 */

var ProductModel = t.struct({
    _id: t.maybe(t.Str),
    product_title: ProductTitle,
    merchant_sku: t.Str,
    ASIN: t.maybe(t.Str),
    standard_product_codes: StandardProductCodeArray,
    multipack_quantity: MultipackQuantity,
    brand: t.maybe(_lengthValidatedString(1, 50)),
    manufacturer: t.maybe(_lengthValidatedString(1, 50)),
    mfr_part_number: t.maybe(_lengthValidatedString(0, 50)),
    product_description: t.maybe(_lengthValidatedString(1, 2000)),
    number_units_for_price_per_unit: t.maybe(t.Number),
    type_of_unit_for_price_per_unit: t.maybe(t.Str),
    shipping_weight_pounds: t.maybe(FloatPrecisionTwo),
    package_length_inches: t.maybe(FloatPrecisionTwo),
    package_width_inches: t.maybe(FloatPrecisionTwo),
    package_height_inches: t.maybe(FloatPrecisionTwo),
    display_length_inches: t.maybe(FloatPrecisionTwo),
    display_width_inches: t.maybe(FloatPrecisionTwo),
    display_height_inches: t.maybe(FloatPrecisionTwo),
    prop_65: t.maybe(t.Boolean),
    legal_disclaimer_description: t.maybe(_lengthValidatedString(0, 500)),
    cpsia_cautionary_statements: t.maybe(t.list(t.enums.of([
        "no warning applicable",
        "choking hazard small parts",
        "choking hazard is a small ball",
        "choking hazard is a marble",
        "choking hazard contains a small ball",
        "choking hazard contains a marble",
        "choking hazard balloon"
    ]))),
    country_of_origin: t.maybe(_lengthValidatedString(0, 50)),
    safety_warning: t.maybe(_lengthValidatedString(0, 500)),
    start_selling_date: t.Date, // ISO 8601 valid
    fulfillment_time: t.Number,
    msrp: t.maybe(t.subtype(t.Number, ProductValidationHelper.validateMsrp)),
    map_price: t.maybe(t.subtype(t.Number, ProductValidationHelper.validateMapPrice)),
    map_implementation: t.maybe(t.enums({
        "103": "103: Jet member savings never applied to product",
        "102": "102: Jet member savings on product only visible to logged in Jet members",
        "101": "101: no restrictions on product based pricing"
    })),
    product_tax_code: t.maybe(t.enums.of([
        'Toilet Paper',
        'Thermometers',
        'Sweatbands',
        'SPF Suncare Products',
        'Sparkling Water',
        'Smoking Cessation',
        'Shoe Insoles',
        'Safety Clothing',
        'Pet Foods',
        'Paper Products',
        'OTC Pet Meds',
        'OTC Medication',
        'Oral Care Products',
        'Non-Motorized Boats',
        'Non Taxable Product',
        'Mobility Equipment',
        'Medicated Personal Care Items',
        'Infant Clothing',
        'Helmets',
        'Handkerchiefs',
        'Generic Taxable Product',
        'General Grocery Items',
        'General Clothing',
        'Fluoride Toothpaste',
        'Feminine Hygiene Products',
        'Durable Medical Equipment',
        'Drinks under 50 Percent Juice',
        'Disposable Wipes',
        'Disposable Infant Diapers',
        'Dietary Supplements',
        'Diabetic Supplies',
        'Costumes',
        'Contraceptives',
        'Contact Lens Solution',
        'Carbonated Soft Drinks',
        'Car Seats',
        'Candy with Flour',
        'Candy',
        'Breast Pumps',
        'Braces and Supports',
        'Bottled Water Plain',
        'Beverages with 51 to 99 Percent Juice',
        'Bathing Suits',
        'Bandages and First Aid Kits',
        'Baby Supplies',
        'Athletic Clothing',
        'Adult Diapers'
    ])),
    no_return_fee_adjustment: t.maybe(t.subtype(t.Number, ProductValidationHelper.validateNoReturnFeeAdjustment)),
    exclude_from_fee_adjustments: t.maybe(t.Boolean),
    ships_alone: t.maybe(t.Boolean)
});

var AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT = _renderHelpText('At least one of the following must be provided for each merchant SKU: Standard Product Code (UPC, GTIN-14 etc.), ASIN, or Brand and Manufacturer Part Number.');
var AT_LEAST_ONE_PER_SKU_PLACEHOLDER = {
    help: AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT
};

var FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT = _renderHelpText('A number with 2 decimals');
var FLOAT_PRECISION_TWO_PLACEHOLDER = {
    help: FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT
};

/**
 * @param product
 * @returns {{}}
 */
var optionsFactory = function optionsFactory(product) {
    return {
        fields: {
            _id: {
                type: "hidden"
            },
            merchant_sku: {
                disabled: product._id ? true : false
            },
            standard_product_codes: AT_LEAST_ONE_PER_SKU_PLACEHOLDER,
            brand: AT_LEAST_ONE_PER_SKU_PLACEHOLDER,
            mfr_part_number: AT_LEAST_ONE_PER_SKU_PLACEHOLDER,
            prop_65: {
                help: _renderHelpText('You must tell us if your product is subject to Proposition 65 rules and regulations. Proposition 65 requires merchants to provide California consumers with special warnings for products that contain chemicals known to cause cancer, birth defects, or other reproductive harm, if those products expose consumers to such materials above certain threshold levels. The default value for this is "false," so if you do not populate this column, we will assume your product is not subject to this rule. Please view this website for more information: http://www.oehha.ca.gov/.')
            },
            cpsia_cautionary_statements: {
                factory: t.form.Select
            },
            fulfillment_time: {
                help: _renderHelpText('Number of business days from receipt of an order for the given merchant SKU until it will be shipped (only populate if it is different than your account default).\
                    Valid Values: \
                    0 = ships the day the OrderMessage is received \
                    1 = ships one business day after the "merchant_order" is received \
                    2= ships two business days after the "merchant_order" is received \
                    N = ships N business days after the "merchant_order" is received')
            },
            shipping_weight_pounds: FLOAT_PRECISION_TWO_PLACEHOLDER,
            package_length_inches: FLOAT_PRECISION_TWO_PLACEHOLDER,
            package_width_inches: FLOAT_PRECISION_TWO_PLACEHOLDER,
            package_height_inches: FLOAT_PRECISION_TWO_PLACEHOLDER,
            display_length_inches: FLOAT_PRECISION_TWO_PLACEHOLDER,
            display_width_inches: FLOAT_PRECISION_TWO_PLACEHOLDER,
            display_height_inches: FLOAT_PRECISION_TWO_PLACEHOLDER,
            msrp: {
                help: _renderHelpText('A number with up to 18 digits allowed to the left of the decimal point and 2 digits to the right of the decimal point. Commas or currency symbols are not allowed')
            },
            map_price: {
                help: _renderHelpText('Retailer price for the product for which member savings will be applied (if applicable, see map_implementation)')
            },
            map_implementation: {
                help: _renderHelpText('The type of rule that indicates how Jet member savings are allowed to be applied to an item’s base price (which is referred to as map_price in the API documentation)')
            },
            no_return_fee_adjustment: {
                help: _renderHelpText('Overides the category level setting for this fee adjustment; this is the increase in commision you are willing to pay on this product if the customer waives their ability to return it.If you want to increase the commission you are willing to pay from a base rate of 15% to 17%, then you should enter "0.02"')
            },
            exclude_from_fee_adjustments: {
                help: _renderHelpText("This SKU will not be subject to any fee adjustment rules that are set up if this field is 'true'")
            },
            ships_alone: {
                help: _renderHelpText("If this field is 'true', it indicates that this 'merchant SKU' will always ship on its own.A separate 'merchant_order' will always be placed for this 'merchant_SKU', one consequence of this will be that this merchant_sku will never contriube to any basket size fee adjustments with any other merchant_skus.")
            },

        }
    };
};

function _renderHelpText(str) {
    return <i>{str}</i>;
}

/**
 *
 * @param min
 * @param max
 * @private
 */
function _lengthValidatedString(min, max) {
    return t.subtype(t.Str, function(str) {
        return ProductValidationHelper.validateString(str, min, max)
    });
}


module.exports.model = ProductModel;
module.exports.optionsFactory = optionsFactory;



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
