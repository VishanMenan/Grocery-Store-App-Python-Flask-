from sql_connection import get_sql_connection

def get_all_products(connection):

    cursor = connection.cursor()

    query = "SELECT products.product_id, products.product_name, products.product_uom_id, products.product_price_per_unit, uom.uom_name FROM products inner join uom on products.product_uom_id=uom.uom_id;"

    cursor.execute(query)

    response = []

    for (product_id, product_name, product_uom_id, product_price_per_unit, uom_name) in cursor:
        response.append(
            {
                'product_id' : product_id,
                'product_name' : product_name,
                'product_uom_id' : product_uom_id,
                'product_price_per_unit' : product_price_per_unit,
                'uom_name' : uom_name
            }
        )

    return response

def insert_new_product(connection, product):

    cursor = connection.cursor()

    query = ("INSERT INTO products (product_name, product_uom_id, product_price_per_unit) VALUES (%s, %s, %s)")
    data = (product['product_name'], product['product_uom_id'], product['product_price_per_unit'])
    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid

def delete_product(connection, product_id):

    cursor = connection.cursor()

    query = ("DELETE FROM products WHERE product_id=" + str(product_id))
    cursor.execute(query)
    connection.commit()

def update_product(connection, product):
    cursor = connection.cursor()
    query = ("UPDATE products SET product_name = %s, product_uom_id = %s, product_price_per_unit = %s WHERE product_id = %s")
    data = (product['product_name'], product['product_uom_id'], product['product_price_per_unit'], product['product_id'])
    cursor.execute(query, data)
    connection.commit()
    return product['product_id']

if __name__=='__main__':
    connection = get_sql_connection()
    print(delete_product(connection, 12))