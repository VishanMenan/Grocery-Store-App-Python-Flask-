$(function () {
    //Json data by api call for order table
    $.get(orderListApiUrl, function (response) {
        if(response) {
            var table = '';
            var totalIncome = 0;
            $.each(response, function(index, order) {
                totalIncome += parseFloat(order.order_total_price);
                table += '<tr>' +
                    '<td style="text-align: center;">'+ order.order_date_time +'</td>'+
                    '<td style="text-align: center;">'+ order.order_id +'</td>'+
                    '<td style="text-align: center;">'+ order.order_cust_name +'</td>'+
                    '<td style="text-align: center;">RM '+ order.order_total_price.toFixed(2) +'</td>'+
                    '<td style="text-align: center;"><button class="btn btn-sm btn-primary view-details" data-order-id="'+ order.order_id +'">View</button></td></tr>';
            });
            table += '<tr><td colspan="4" style="text-align: end"><b>Total Income</b></td><td style="text-align: center;"><b>RM '+ totalIncome.toFixed(2) +'</b></td></tr>';
            $("table").find('tbody').empty().html(table);
        }
    });

    $(document).on('click', '.view-details', function(event) {
        event.preventDefault();
        var orderId = $(this).data('order-id');
        console.log('View button clicked for order ID:', orderId);
        window.location.href = 'order_details.html?order_id=' + orderId;
    });
});