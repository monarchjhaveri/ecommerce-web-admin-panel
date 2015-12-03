var React = require('react');
var t = require('tcomb-form');
var ProductValidationHelper = require("../../../../helpers/ProductValidationHelper");
var jQuery = require("jquery");

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

var AlternateImage = t.struct({
    image_slot_id: t.Number,
    image_url: t.String
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

var SkuAttribute = t.struct({
    attribute_id: t.Number,
    attribute_value: t.String,
    attribute_value_unit: t.maybe(t.String)
});

// unused fields
/*
 * jet_browse_node_id
 * amazon_item_type_keyword
 * category_path
 *
 */
var _productModel = {
    _id: t.maybe(t.Str),
        product_title: ProductTitle,
    jet_browse_node_id: t.maybe(t.Number),
    amazon_item_type_keyword: t.maybe(t.String),
    category_path: t.maybe(t.String),
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
    shipping_weight_pounds: t.maybe(t.Number),
    package_length_inches: t.maybe(t.Number),
    package_width_inches: t.maybe(t.Number),
    package_height_inches: t.maybe(t.Number),
    display_length_inches: t.maybe(t.Number),
    display_width_inches: t.maybe(t.Number),
    display_height_inches: t.maybe(t.Number),
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
        start_selling_date: t.maybe(t.Date), // ISO 8601 valid
        fulfillment_time: t.maybe(t.Number),
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
    ships_alone: t.maybe(t.Boolean),
    attributes_node_specific: t.maybe(t.list(SkuAttribute)),
    main_image_url: t.maybe(t.String),
    swatch_image_url: t.maybe(t.String),
    alternate_images: t.maybe(t.list(AlternateImage))
};

var ProductModel = t.struct(_productModel);

var AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT = "At least one of the following must be provided for each merchant SKU: Standard Product Code (UPC, GTIN-14 etc.), ASIN, or Brand and Manufacturer Part Number.";

var FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT = 'A number with 2 decimals';

function _mergeUniqueLeft(array1, array2) {
    var returnArray = jQuery.extend(true, [], array1);
    for (var i = 0; i < array2.length; i++) {
        if (returnArray.indexOf(array2[i]) === -1) {
            returnArray.push(array2[i]);
        }
    }
    return returnArray;
}

/**
 * @param product
 * @returns {{}}
 */
var optionsFactory = function optionsFactory(product) {
    return {
        order: _mergeUniqueLeft(
            ['merchant_sku', 'product_title','multipack_quantity', 'standard_product_codes', 'main_image_url', 'swatch_image_url', 'alternate_images'],
            Object.keys(_productModel)
        ),
        fields: {
            _id: {
                type: "hidden"
            },
            merchant_sku: {
                disabled: product._id ? true : false
            },
            product_title: _helpBoxOnly('Short product description. 5 to 500 alphanumeric characters'),
            jet_browse_node_id: _helpBoxOnly('The unique ID that defines where the product will be found in the Jet.com browse structure. This must be a valid jet_browse_node_id'),
            amazon_item_type_keyword: _helpBoxOnly("ItemType allows customers to find your products as they browse to the most specific item types. Please use the exact selling from Amazon's browse tree guides"),
            category_path: _helpBoxOnly("Please enter a category path using your own product taxonomy"),
            standard_product_codes: _helpBoxOnly(<span>The barcode or barcode that is associated with the product <br/> {AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT}</span>),
            ASIN: _helpBoxOnly(<span>Amazon standard identification number for this merchant SKU if available <br/> {AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT}</span>),
            multipack_quantity: _helpBoxOnly(<span>Number of items with the given Standard Product Code that makes up your merchant SKU <br/> {AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT}</span>),
            brand: _helpBoxOnly(<span>Brand of the merchant SKU <br/> {AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT}</span>),
            manufacturer: _helpBoxOnly("Manufacturer of the merchant SKU"),
            mfr_part_number: _helpBoxOnly(<span>Part number provided by the original manufacturer of the merchant SKU<br/> {AT_LEAST_ONE_PER_SKU_PLACEHOLDER_TEXT}</span>),
            product_description: _helpBoxOnly("Long description of the merchant SKU"),
            bullets: _helpBoxOnly("Merchant SKU feature description"),
            number_units_for_price_per_unit: _helpBoxOnly("For Price Per Unit calculations, the number of units included in the merchant SKU. The unit of measure must be specified in order to indicate what is being measured by the unit-count"),
            type_of_unit_for_price_per_unit: _helpBoxOnly("The type_of_unit_for_price_per_unit attribute is a label for the number_units_for_price_per_unit. The price per unit can then be constructed by dividing the selling price by the number of units and appending the text 'per unit value.' For example, for a six-pack of soda, number_units_for_price_per_unit= 6, type_of_unit_for_price_per_unit= can, price per unit = price per can."),
            shipping_weight_pounds: _helpBoxAndPrecisionTwo(<span>Weight of the merchant SKU when in its shippable configuration<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            package_length_inches: _helpBoxAndPrecisionTwo(<span>Length of the merchant SKU when in its shippable configuration<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            package_width_inches: _helpBoxAndPrecisionTwo(<span>Width of the merchant SKU when in its shippable configuration<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            package_height_inches: _helpBoxAndPrecisionTwo(<span>Height of the merchant SKU when in its shippable configuration<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            display_length_inches: _helpBoxAndPrecisionTwo(<span>Length of the merchant SKU when in its fully assembled/usable condition<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            display_width_inches: _helpBoxAndPrecisionTwo(<span>Width of the merchant SKU when in its fully assembled/usable condition<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            display_height_inches: _helpBoxAndPrecisionTwo(<span>Height of the merchant SKU when in its fully assembled/usable condition<br/> {FLOAT_PRECISION_TWO_PLACEHOLDER_TEXT}</span>),
            legal_disclaimer_description: _helpBoxOnly("Any legal language required to be displayed with the product. Max 500 characters."),
            prop_65: _helpBoxOnly('You must tell us if your product is subject to Proposition 65 rules and regulations. Proposition 65 requires merchants to provide California consumers with special warnings for products that contain chemicals known to cause cancer, birth defects, or other reproductive harm, if those products expose consumers to such materials above certain threshold levels. The default value for this is "false," so if you do not populate this column, we will assume your product is not subject to this rule. Please view this website for more information: http://www.oehha.ca.gov/.'),
            cpsia_cautionary_statements: {
                help: "Use CTRL + click (CMD + click in OSX) to multiselect",
                factory: t.form.Select
            },
            country_of_origin: _helpBoxOnly("The country that the item was manufactured in."),
            safety_warning: _helpBoxOnly("If applicable, use to supply any associated warnings for your product. Max 500 characters."),
            start_selling_date: _helpBoxOnly("If updating merchant SKU that has quantity = 0 at all FCs, date that the inventory in this message should be available for sale on Jet.com. You should only use this field if the quantity for the merchant SKU is 0 at all merchant_fcs."),
            fulfillment_time: {
                help: _renderHelpText('Number of business days from receipt of an order for the given merchant SKU until it will be shipped (only populate if it is different than your account default).\
                    Valid Values: \
                    0 = ships the day the OrderMessage is received \
                    1 = ships one business day after the "merchant_order" is received \
                    2= ships two business days after the "merchant_order" is received \
                    N = ships N business days after the "merchant_order" is received')
            },
            msrp: _helpBoxOnly('A number with up to 18 digits allowed to the left of the decimal point and 2 digits to the right of the decimal point. Commas or currency symbols are not allowed'),
            map_price: _helpBoxOnly('Retailer price for the product for which member savings will be applied (if applicable, see map_implementation)'),
            map_implementation: _helpBoxOnly('The type of rule that indicates how Jet member savings are allowed to be applied to an item’s base price (which is referred to as map_price in the API documentation)'),
            product_tax_code: _helpBoxOnly("Jet's standard code for the tax properties of a given product."),
            no_return_fee_adjustment: _helpBoxOnly('Overides the category level setting for this fee adjustment; this is the increase in commision you are willing to pay on this product if the customer waives their ability to return it.If you want to increase the commission you are willing to pay from a base rate of 15% to 17%, then you should enter "0.02"'),
            exclude_from_fee_adjustments: _helpBoxOnly("This SKU will not be subject to any fee adjustment rules that are set up if this field is 'true'"),
            ships_alone: _helpBoxOnly("If this field is 'true', it indicates that this 'merchant SKU' will always ship on its own.A separate 'merchant_order' will always be placed for this 'merchant_SKU', one consequence of this will be that this merchant_sku will never contriube to any basket size fee adjustments with any other merchant_skus."),
            attributes_node_specific: {
                help: _renderHelpText(
                    <span>
                        <b>Attribute ID:</b> The node attribute ID number that you get from Jet provided documentation that corresponds with the attribute you are passing. <br/>
                        <b>Attribute Value:</b> The value for the attribute. For example, if the attribute is size you may pass 'large' or if the the attribute is weight, you may pass '22'. For attributes like weight the unit will be passed in the next field. <br/>
                        <b>Attribute Value Unit:</b> If the attribute_value requires a unit, then you pass the unit here. <br/>
                    </span>
                )
            },
            main_image_url: _helpBoxOnly("URL location where Jet.com can access the image. The images should be 1500 x 1500 pixels or larger, but anything 500 x 500 pixels or larger is acceptable. There is no limit to image size."),
            swatch_image_url: _helpBoxOnly("URL location where Jet.com can access an image of a color or fabric for a given merchant SKU. The images should be 1500 x 1500 pixels or larger, but anything 500 x 500 pixels or larger is acceptable. There is no limit to image size."),
            alternate_images: _helpBoxOnly(
                <span>
                    <b>Image Slot Id:</b> The slot that the alternate image should be uploaded to. Jet.com supports up to 8 images (or 8 image slots).<br/>
                    <b>Image Url:</b> The absolute location where Jet.com can retrieve the image<br/>
                </span>
            )
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

var FloatPrecisionTwoTransformer = {
    format: function(value){
        return value;
    },
    parse: function(value) {
        if (value) {
            var numerical = Number.parseFloat(value);
            return isNaN(numerical) ? value : numerical;
        } else {
            return null;
        }
    }
};

function _helpBoxOnly(content) {
    return {
        help: _renderHelpText(content)
    }
}

function _helpBoxAndPrecisionTwo(content) {
    var o = _helpBoxOnly(content);
    o.transformer = FloatPrecisionTwoTransformer;
    return o;
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
