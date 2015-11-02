var connect = require("react-redux").connect;
var LoadingModal = require("../modals/LoadingModal.js");

function mapStateToProps(state) {
    console.log("mapStateToProps called with", state);
    return {
        loading: state.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LoadingModal);