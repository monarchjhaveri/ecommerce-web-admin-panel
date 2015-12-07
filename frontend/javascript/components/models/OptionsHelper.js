var jQuery = require("jquery");
var ModelConstants = require("./ModelConstants");
var React = require("react");

module.exports = {
    applyDefaultOptions(object) {
        return jQuery.extend(true, {}, ModelConstants.commonOptions, object);
    },

    /**
     * The orderedFields param should include the fields to be ordered; the remainder of the fields will be deduced from
     * the model object. Example:
     * return OptionsHelper.applyDefaultOptions({
     *      help: OptionsHelper.generateFieldOrderArrayForModel(['field1', 'field2'], model)
     * });
     * #NOTE: The model must NOT be a tcomb-form struct; it should be object PASSED INTO the t.Struct function
     * @param {![String]} orderedFields
     * @param {!Object} model
     * @returns {[String]}
     */
    generateFieldOrderArrayForModel(orderedFields, model) {
        return _mergeUniqueLeft(orderedFields, Object.keys(model));
    },
    helpRenderers: {
        helpBoxOnly: function(content){
            return {
                help: _renderHelpText(content)
            }
        },
        helpText: _renderHelpText
    }
};

function _mergeUniqueLeft(array1, array2) {
    var returnArray = jQuery.extend(true, [], array1);
    for (var i = 0; i < array2.length; i++) {
        if (returnArray.indexOf(array2[i]) === -1) {
            returnArray.push(array2[i]);
        }
    }
    return returnArray;
}

function _renderHelpText(str) {
    return <i>{str}</i>;
}