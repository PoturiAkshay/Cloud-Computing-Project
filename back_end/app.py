from flask import Flask, render_template, request
from flask_mysqldb import MySQL
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'proj5409test'
app.config['MYSQL_DB'] = 'proj5409test'

mysql = MySQL(app)


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'hi'

@app.route('/search/<loc>', methods=['GET'])
def index(loc):
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, name, price, description, image, address, highlights from location WHERE name LIKE %s OR address LIKE %s OR highlights LIKE %s', ("%"+loc+"%", "%"+loc+"%", "%"+loc+"%"))
    mysql.connection.commit()
    rows = cur.fetchall()
    items = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    return {'items':items}

@app.route('/orderDetails/<id>', methods=['GET'])
def getOrderDetails(id):
    cur = mysql.connection.cursor()
    cur.execute('SELECT t.id as id, l1.address as source_id, l2.address as dest_id , t.date,t.time, t.num_passengers FROM trips t INNER JOIN location l1 ON l1.id=t.source_id INNER JOIN location l2 ON l2.id=t.dest_id where  t.user_id='+id)
    mysql.connection.commit()
    rows = cur.fetchall()
    # print(rows)
    result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    print(result)
    cur.close()
    return {'result':result}
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



    # https://dba.stackexchange.com/questions/37014/in-what-data-type-should-i-store-an-email-address-in-database
    # https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853