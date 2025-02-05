def get_uoms(connection):
    cursor = connection.cursor()
    query = ("SELECT * from uom")
    cursor.execute(query)
    response = []
    for (uom_id, uom_name) in cursor:
        response.append({
            'uom_id': uom_id,
            'uom_name': uom_name
        })
    return response

def get_uom_name(connection, uom_id):
    cursor = connection.cursor()
    query = ("SELECT uom_name FROM uom WHERE uom_id = %s")
    data = (uom_id,)
    cursor.execute(query, data)
    uom_name = cursor.fetchone()[0]
    return uom_name

if __name__ == '__main__':
    from sql_connection import get_sql_connection

    connection = get_sql_connection()
    print(get_uoms(connection))
    print(get_uom_name(connection, 1))