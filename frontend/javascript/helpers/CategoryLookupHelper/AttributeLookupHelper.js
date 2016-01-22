var category_attribute_mappings = clone(require("./files/category_attribute_mappings.json"));
var attributes = clone(require("./files/attributes.json"));
var attribute_values = clone(require("./files/attribute_values.json"));

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    findByCategoryId(categoryId) {
        var found_mapping = category_attribute_mappings.find(function(d){return d.category_id === categoryId});
        if (!found_mapping) { return null; }

        var found_attributes = attributes.map(function(d){return d.id === found_mapping.attribute_id});
        if (!found_attributes || found_attributes.length === 0) { return null; }

        found_attributes.map(function(attr) {
            attr.values = attribute_values.map(function(d){return d.attribute_id === attr.id});
        });

        return found_attributes;
    }
};