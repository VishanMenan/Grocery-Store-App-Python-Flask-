var productPrices = {};
var productUOMs = {};

$(function () {
    //Json data by api call for order table
    $.get(productListApiUrl, function (response) {
        productPrices = {};
        productUOMs = {};
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.product_id +'">'+ product.product_name +'</option>';
                productPrices[product.product_id] = product.product_price_per_unit;
                productUOMs[product.product_id] = product.uom_name;
            });
            $(".product-box").find("select").empty().html(options);
        }
    });
});

$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.00');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.00');
    $(".product-box-extra").find('.uom-name').last().text('');
});

$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});

$(document).on("change", ".cart-product", function (){
    var product_id = $(this).val();
    var price = productPrices[product_id];
    var uom = productUOMs[product_id];

    $(this).closest('.row').find('#product_price').val(price);
    $(this).closest('.row').find('.uom-name').text('/' + uom);
    calculateValue();
});

$(document).on("change", ".product-qty", function (e){
    calculateValue();
});

$("#saveOrder").on("click", function(){
    var formData = $("form").serializeArray();
    var requestPayload = {
        order_cust_name: null,
        order_total_price: null,
        order_details: []
    };
    var orderDetails = [];
    var isValid = true;
    var errorMessage = "";

    for(var i=0;i<formData.length;++i) {
        var element = formData[i];
        var lastElement = null;

        switch(element.name) {
            case 'customerName':
                if (!element.value) {
                    isValid = false;
                    errorMessage += "Customer name cannot be empty.\n";
                }
                requestPayload.order_cust_name = element.value;
                break;
            case 'product_grand_total':
                requestPayload.order_total_price = element.value;
                break;
            case 'product':
                if (element.value === "") {
                    isValid = false;
                    errorMessage += "Invalid item selected.\n";
                }
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });                
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                if (element.value <= 0 || !Number.isInteger(Number(element.value))) {
                    isValid = false;
                    errorMessage += "Quantity must be a whole number greater than zero(0).\n";
                }
                lastElement.quantity = element.value;
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.total_price = element.value;
                break;
        }
    }

    if (!isValid) {
        alert(errorMessage);
        return;
    }

    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});