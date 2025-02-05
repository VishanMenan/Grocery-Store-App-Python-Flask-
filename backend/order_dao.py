from datetime import datetime
from sql_connection import get_sql_connection

def insert_order(connection, order):
    cursor = connection.cursor()
    
    # Debug print to check the order data
    print("Order Data:", order)
    
    order_query = ("INSERT INTO orders "
                   "(order_cust_name, order_total_price, order_date_time) "
                   "VALUES (%s, %s, %s)")
    order_data = (order['order_cust_name'], order['order_total_price'], datetime.now())
    
    # Debug print to check the order query data
    print("Order Query Data:", order_data)
    
    cursor.execute(order_query, order_data)

    order_id = cursor.lastrowid

    order_details_query = ("INSERT INTO order_details "
                           "(order_id, product_id, quantity, total_price) "
                           "VALUES (%s, %s, %s, %s)")
    
    order_details_data = []

    for order_details_record in order['order_details']:
        order_details_data.append([
            order_id,
            int(order_details_record['product_id']),
            float(order_details_record['quantity']),
            float(order_details_record['total_price'])
        ])
    
    # Debug print to check the order details data
    print("Order Details Data:", order_details_data)
    
    cursor.executemany(order_details_query, order_details_data)

    connection.commit()

    return order_id

def get_all_orders(connection):
    cursor = connection.cursor()
    query = ("SELECT * from orders")
    cursor.execute(query)

    response = []
    for (order_id, order_cust_name, order_total_price, order_date_time) in cursor:
        response.append({
            'order_id': order_id,
            'order_cust_name': order_cust_name,
            'order_total_price': order_total_price,
            'order_date_time': order_date_time
        })
    return response

def get_order_details(connection, order_id):
    cursor = connection.cursor()
    
    # Fetch order information
    order_info_query = ("SELECT order_id, order_cust_name, order_date_time "
                        "FROM orders "
                        "WHERE order_id = %s")
    cursor.execute(order_info_query, (order_id,))
    order_info = cursor.fetchone()
    
    # Fetch order details
    order_details_query = ("SELECT products.product_name, order_details.quantity, order_details.total_price "
                           "FROM order_details "
                           "JOIN products ON order_details.product_id = products.product_id "
                           "WHERE order_details.order_id = %s")
    cursor.execute(order_details_query, (order_id,))
    
    order_details = []
    for (product_name, quantity, total_price) in cursor:
        order_details.append({
            'product_name': product_name,
            'quantity': quantity,
            'total_price': total_price
        })
    
    return {
        'order_info': {
            'order_id': order_info[0],
            'order_cust_name': order_info[1],
            'order_date_time': order_info[2]
        },
        'order_details': order_details
    }

if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_all_orders(connection))