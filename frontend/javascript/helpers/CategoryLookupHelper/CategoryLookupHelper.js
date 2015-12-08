var fuzzy= require("fuzzy");

var FUZZY_INDEXES_LIST = [];
var CATEGORIES_MAP_TO_FUZZY_INDEXES = {};
var CATEGORIES_MAP_TO_ID_INDEXES = {};
var CATEGORIES = require("./files/categories.json")
    .filter(function(d) {
        // filter out inactive and retired items.
        return d.active != false && d.retired != false;
    });
CATEGORIES.forEach(function(d) {
    var fuzzySearchText = "" + d.id + d.path;
    CATEGORIES_MAP_TO_FUZZY_INDEXES[fuzzySearchText] = d;
    CATEGORIES_MAP_TO_ID_INDEXES[d.id] = d;
    FUZZY_INDEXES_LIST.push(fuzzySearchText);
});

CATEGORIES.forEach(function(d) {
    if (d.parent_id && CATEGORIES_MAP_TO_ID_INDEXES[d.parent_id]) {
        d.parent = CATEGORIES_MAP_TO_ID_INDEXES[d.parent_id];
        d.parent.children = d.parent.children || [];
        d.parent.children.push(d);
    }
});

module.exports = {
    findInCategories: function(pattern) {
        var results = fuzzy.filter(pattern, FUZZY_INDEXES_LIST);
        return results.map(function(d) {
            return CATEGORIES_MAP_TO_FUZZY_INDEXES[d.string]
        })
    }
};