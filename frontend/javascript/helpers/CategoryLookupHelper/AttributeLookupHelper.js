var category_attribute_mappings = clone(require("./files/category_attribute_mappings.json"));
var attributes = clone(require("./files/attributes.json"));
var attribute_values = clone(require("./files/attribute_values.json"));

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    findByCategoryId(categoryId) {
        var found_attribute_ids = category_attribute_mappings
            .filter(function(d){return d.category_id === categoryId})
            .map(function(d){return d.attribute_id;});
        if (found_attribute_ids.length === 0) { return null; }

        return found_attribute_ids.map(function(attrid){return attributes.find(function(attr){return attr.id === attrid})});
    }
};