var $ = require("jquery");
var ActionTypes = require("./ActionTypes");
var Constants = require("../Constants");
var PopoverAC = require("./PopoverAC");

var ProductAC = {
    fetchAll: function() {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.FETCH_ALL_STARTED
            });
            $.ajax({
                url: "api/products",
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.FETCH_ALL_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    edit: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(product),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.EDIT_SUCCESS,
                        payload: data
                    });
                    PopoverAC.displaySuccessFromText("Product successfully edited.");
                    dispatch(ProductAC.getDetails(product));
                }
            });
        });
    },
    create: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.CREATE_STARTED
            });
            $.ajax({
                method: "POST",
                url: "api/products",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(product),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.CREATE_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.CREATE_SUCCESS,
                        payload: data
                    });
                    PopoverAC.displaySuccessFromText("Product successfully created.");
                    ProductAC.getDetails(product);
                }
            });
        });
    },
    getDetails: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.GET_DETAILS_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/products/:sku"
                    .replace(":sku", product.merchant_sku),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.GET_DETAILS_FAILURE,
                        payload: error
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.GET_DETAILS_SUCCESS,
                        payload: data
                    });
                    dispatch({
                        type: ActionTypes.PRODUCTS.SELECT,
                        payload: data
                    });
                }
            });
        });
    },
    getInventory: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.INVENTORY.GET_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/products/:sku/inventory"
                    .replace(":sku", product.merchant_sku),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.GET_FAILURE,
                        payload: {
                            product: product,
                            error: error
                        }
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.GET_SUCCESS,
                        payload: {
                            product: product,
                            inventory: data
                        }
                    });
                }
            });
        });
    },
    editInventory: function(editInventoryObject) {
        var product = editInventoryObject.product;
        var merchant_sku = product &&  product.merchant_sku;
        var payload = editInventoryObject.payload;
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.INVENTORY.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products/{id}/inventory".replace("{id}", merchant_sku),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(payload),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.INVENTORY.EDIT_SUCCESS,
                        payload: data
                    });
                    PopoverAC.displaySuccessFromText("Inventory successfully edited.");
                }
            });
        });
    },
    getPrice: function(product) {
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.PRICE.GET_STARTED
            });
            $.ajax({
                method: "GET",
                url: "api/products/:sku/price"
                    .replace(":sku", product.merchant_sku),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.PRICE.GET_FAILURE,
                        payload: {
                            product: product,
                            error: error
                        }
                    });
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.PRICE.GET_SUCCESS,
                        payload: {
                            product: product,
                            priceInfo: data
                        }
                    });
                }
            });
        });
    },
    editPrice: function(editPriceObject) {
        var product = editPriceObject.product;
        var merchant_sku = product &&  product.merchant_sku;
        var payload = editPriceObject.payload;
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.PRICE.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products/{id}/price".replace("{id}", merchant_sku),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(payload),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.PRICE.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    PopoverAC.displaySuccessFromText("Product price successfully edited.");
                    dispatch({
                        type: ActionTypes.PRODUCTS.PRICE.EDIT_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    editVariation: function(editVariationObject) {
        var product = editVariationObject.product;
        var merchant_sku = product &&  product.merchant_sku;
        var payload = editVariationObject.payload;
        store.dispatch(function (dispatch) {
            dispatch({
                type: ActionTypes.PRODUCTS.VARIATION.EDIT_STARTED
            });
            $.ajax({
                method: "PUT",
                url: "api/products/{id}/variation".replace("{id}", merchant_sku),
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(payload),
                error: function(request, error) {
                    dispatch({
                        type: ActionTypes.PRODUCTS.VARIATION.EDIT_FAILURE,
                        payload: error
                    });
                    ProductAC.getDetails(product);
                    PopoverAC.displayError(request);
                },
                success: function(data) {
                    PopoverAC.displaySuccessFromText("Product variation successfully edited.");
                    dispatch({
                        type: ActionTypes.PRODUCTS.VARIATION.EDIT_SUCCESS,
                        payload: data
                    });
                }
            });
        });
    },
    openEditorToCreate: function() {
        store.dispatch({
            type: ActionTypes.PRODUCTS.SELECT,
            payload: {}
        });
    },
    clearSelection: function() {
        store.dispatch({
            type: ActionTypes.PRODUCTS.CLEAR_SELECTION
        });
    }
};

module.exports = ProductAC;