var categories = clone(require("./files/categories.json"));
var category_attribute_mappings = clone(require("./files/category_attribute_mappings.json"));
var attributes = clone(require("./files/attributes.json"));
var attribute_values = clone(require("./files/attribute_values.json"));
var fs = require("fs");

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function generate() {
    attributes.forEach(function(attribute) {
        attribute_values.forEach(function(attribute_value) {
            if(attribute["id"] === attribute_value["attribute_id"]) {
                attribute.values = attribute.values || [];
                attribute.values.push(attribute_value)
            }
        });
    });

    var map = {};

    var mappings_parsed = 0;
    category_attribute_mappings.forEach(function(mapping) {
        var category_found = categories.find(function(category) {
            return category.id === mapping.category_id;
        });
        var attribute_found = attributes.find(function(attribute) {
            return attribute.id === mapping.attribute_id;
        });
        if (category_found && attribute_found) {
            map[category_found.id] = map[category_found.id] || [];
            map[category_found.id].push(attribute_found);
        }
        mappings_parsed++;
    });

    console.log("ended mapping.");

    fs.writeFile("./CategoryAttributesMap.json", JSON.stringify(map))

}

generate();
