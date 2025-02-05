var productModal = $("#productModal");
$(function () {
    //JSON data by API call
    $.get(productListApiUrl, function (response) {
        if (response) {
            var table = '';
            $.each(response, function (index, product) {
                table += '<tr data-id="' + product.product_id + '" data-name="' + product.product_name + '" data-unit="' + product.product_uom_id + '" data-price="' + product.product_price_per_unit + '">' +
                    '<td style="text-align: center;">' + product.product_name + '</td>' +
                    '<td style="text-align: center;">' + product.uom_name + '</td>' +
                    '<td style="text-align: center;">' + product.product_price_per_unit + '</td>' +
                    '<td style="text-align: center;">' +
                    '<span class="btn btn-xs btn-danger delete-product">Delete</span>' +
                    ' ' +
                    '<span class="btn btn-xs btn-warning edit-product">Edit</span>' +
                    '</td>' +
                    '</tr>';
            });
            $("table").find('tbody').empty().html(table);
        }
    });
});

// Edit Product
$(document).on("click", ".edit-product", function () {
    var tr = $(this).closest('tr');
    $("#id").val(tr.data('id'));
    $("#name").val(tr.data('name'));
    $("#unit").val(tr.data('unit'));
    $("#price").val(tr.data('price'));
    productModal.find('.modal-title').text('Edit Product');
    $("#saveEditProduct").show();
    $("#saveNewProduct").hide();
    productModal.modal('show');
});

// Save Edited Product
$("#saveEditProduct").on("click", function () {
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_id: $("#id").val(),
        product_name: null,
        product_uom_id: null,
        product_price_per_unit: null
    };
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.product_uom_id = element.value;
                break;
            case 'price':
                requestPayload.product_price_per_unit = element.value;
                break;
        }
    }
    callApi("POST", productUpdateApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

// Add New Product
$(document).on("click", ".btn-primary.pull-right", function () {
    $("#id").val('0');
    $("#name").val('');
    $("#unit").val('');
    $("#price").val('');
    productModal.find('.modal-title').text('Add New Product');
    $("#saveEditProduct").hide();
    $("#saveNewProduct").show();
    productModal.modal('show');
});

// Save New Product
$("#saveNewProduct").on("click", function () {
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_name: null,
        product_uom_id: null,
        product_price_per_unit: null
    };
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.product_uom_id = element.value;
                break;
            case 'price':
                requestPayload.product_price_per_unit = element.value;
                break;
        }
    }
    callApi("POST", productSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

$(document).on("click", ".delete-product", function () {
    var tr = $(this).closest('tr');
    var data = {
        product_id: tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " ?");
    if (isDelete) {
        callApi("POST", productDeleteApiUrl, data);
    }
});

productModal.on('hide.bs.modal', function () {
    $("#id").val('0');
    $("#name, #unit, #price").val('');
    productModal.find('.modal-title').text('Add New Product');
});

productModal.on('show.bs.modal', function () {
    //JSON data by API call
    $.get(uomListApiUrl, function (response) {
        if (response) {
            var options = '<option value="">--Select an option--</option>';
            $.each(response, function (index, uom) {
                options += '<option value="' + uom.uom_id + '">' + uom.uom_name + '</option>';
            });
            $("#uoms").empty().html(options);
        }
    });
});