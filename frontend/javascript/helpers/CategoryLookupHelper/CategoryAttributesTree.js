var categories = clone(require("./files/categories.json"));
var category_attribute_mappings = clone(require("./files/category_attribute_mappings.json"));
var attributes = clone(require("./files/attributes.json"));
var attribute_values = clone(require("./files/attribute_values.json"));

var results = null;

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function main() {
    console.log("starting attribution");

    var attribute_values_counted = 0;
    attributes.forEach(function(attribute) {
        attribute_values.forEach(function(attribute_value) {
            if(attribute["id"] === attribute_value["attribute_id"]) {
                attribute.values = attribute.values || [];
                attribute.values.push(attribute_value)
            }
        });
    });

    console.log("attribute_values length was: ", attribute_values.length);
    console.log("attribute_values counted were: ", attribute_values_counted);

    console.log("starting mapping.");

    var total_mappings = category_attribute_mappings.length;
    var mappings_parsed = 0;
    category_attribute_mappings.forEach(function(mapping) {
        var category_found = categories.find(function(category) {
            return category.id === mapping.category_id;
        });
        var attribute_found = attributes.find(function(attribute) {
            return attribute.id === mapping.attribute_id;
        });
        if (category_found && attribute_found) {
            attribute_found.categories = attribute_found.categories || [];
            attribute_found.categories.push(category_found);
        }
        mappings_parsed++;
        if (mappings_parsed%1000 === 0) {
            console.log("" + mappings_parsed + " of " + total_mappings + " mappings parsed.")
        }
    });

    console.log("ended mapping.");

    return {
        categories: categories,
        attributes: attributes
    }
}

module.exports = main;
