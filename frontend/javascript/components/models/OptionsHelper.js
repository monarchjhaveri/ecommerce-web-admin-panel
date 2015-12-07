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
        /**
         *  Pass in an array of strings to get comma separated strings
         * @param {String|[String]} value
         * @returns {[Object]}
         * @private
         */
        helpBoxOnly: function(value){
            return {
                help: _renderHelpText(value)
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

/**
 *  Pass in an array of strings to get comma separated strings
 * @param {String|[String]} value
 * @returns {[Object]}
 * @private
 */
function _renderHelpText(value) {
    var val;
    if (value instanceof Array) {
        // Insert a <br/> in between all the elements.
        var arr = [];
        value.forEach(function(d, i) {
            arr.push(d);
            if (i !== value.length - 1) {
                arr.push(<br/>);
            }
        });
        return arr;
    } else {
        val = value;
    }
    return <i>{val}</i>;
}