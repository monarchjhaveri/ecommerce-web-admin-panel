var connect = require("react-redux").connect;
var Layout = require("../layout/Layout.js");

function mapStateToProps(state) {
    return {
        state: state
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Layout);