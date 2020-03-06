from flask import Flask, render_template, request
from flask_mysqldb import MySQL
import pymysql

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'proj5409'
app.config['MYSQL_DB'] = 'proj5409test'

mysql = MySQL(app)

@app.route('/search/<loc>', methods=['GET'])
def index(loc):
    cur = mysql.connection.cursor()
    print(loc)
    cur.execute('SELECT id, name, price, description, image, address, highlights from location WHERE name LIKE %s OR address LIKE %s OR highlights LIKE %s', ("%"+loc+"%", "%"+loc+"%", "%"+loc+"%"))
    mysql.connection.commit()
    rows = cur.fetchall()
    items = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    return {'items':items}
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)