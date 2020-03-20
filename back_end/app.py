from flask import Flask, request
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'akshay@1024'
app.config['MYSQL_DB'] = 'Cloud_5409'

mysql = MySQL(app)


@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return 'hi'


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


@app.route('/registration/', methods=['POST'])
def insertUserDetails():
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute(
        'insert into user (name, email, password, dob, sex) values (%s,%s,%s,%s,%s)',(data['name'],data['email'],data['password'],data['dob'],data['sex']))
    mysql.connection.commit()
    cur.close()
    return {'response':"Data successfully inserted in DB"}


if __name__ == '__main__':
    app.run(debug = True, host='0.0.0.0', port=5000)

    # https://dba.stackexchange.com/questions/37014/in-what-data-type-should-i-store-an-email-address-in-database
    # https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853
