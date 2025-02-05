$(function () {
    var orderId = window.location.search.split('order_id=')[1];
    console.log('Order ID:', orderId);

    if (orderId) {
        $.get(orderDetailsApiUrl + '?order_id=' + orderId, function (response) {
            console.log('Response:', response);
            if (response) {
                var orderInfo = response.order_info;
                var orderDetails = response.order_details;

                // Display order information
                var orderInfoHtml = '<p><strong>Order Number:</strong> ' + orderInfo.order_id + '</p>' +
                                    '<p><strong>Customer Name:</strong> ' + orderInfo.order_cust_name + '</p>' +
                                    '<p><strong>Date & Time:</strong> ' + orderInfo.order_date_time + '</p>';
                $("#orderInfo").html(orderInfoHtml);

                // Display order details
                var table = '';
                var grandTotal = 0;
                $.each(orderDetails, function (index, detail) {
                    grandTotal += parseFloat(detail.total_price);
                    table += '<tr>' +
                        '<td style="text-align: center;">' + detail.product_name + '</td>' +
                        '<td style="text-align: center;">' + detail.quantity + '</td>' +
                        '<td style="text-align: center;">RM ' + detail.total_price.toFixed(2) + '</td></tr>';
                });
                table += '<tr><td colspan="2" style="text-align: end"><b>Grand Total</b></td><td style="text-align: center;"><b>RM ' + grandTotal.toFixed(2) + '</b></td></tr>';
                $("table#orderDetailsTable").find('tbody').empty().html(table);
            }
        });
    }

    $("#backButton").click(function () {
        window.location.href = 'index.html';
    });
});
