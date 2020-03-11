from flask import Flask, render_template, request,render_template, jsonify,render_template_string
from flask_mysqldb import MySQL
import pymysql
from flask_cors import CORS
import plotly
import plotly.graph_objs as go

import pandas as pd
import numpy as np
import json

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
    
    cur.close()
    return {'result':result}


@app.route('/analytics', methods=['GET'])
def getAnalytics():
    cur = mysql.connection.cursor()
    cur.execute('select l1.address as city, t.date,count(*) as num_trips from trips t INNER JOIN location l1 ON l1.id=t.dest_id where t.dest_id  group by t.date,t.dest_id')
    mysql.connection.commit()
    rows = cur.fetchall()
    result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    line = create_plot(result)
    res=render_template('analytics.html', plot=line[0],ids=line[1])
    print(res)
    return render_template_string(res)


@app.route('/getBuses/<sourceId>/<destId>',methods=['GET'])
def get_invoice(sourceId,destId):
    cur = mysql.connection.cursor()
    # cur.execute('select id,bus_no, arr_time,dep_time,capacity - num_bookings as seats from bus where source_id=%s and dest_id=%s and capacity <> num_bookings' %(sourceId,destId))
    cur.execute('''select l1.id as src_id, l2.id as dest_id ,l1.address as src,l2.address as dest,bus_no, arr_time,dep_time,(capacity - num_bookings) 
    as seats from bus b INNER JOIN location l1 ON l1.id=b.source_id INNER JOIN location l2 ON l2.id=b.dest_id 
    where source_id=%s and dest_id=%s and capacity <> num_bookings''' %(sourceId,destId))
    mysql.connection.commit()
    rows=cur.fetchall()
    result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    return {'result': result}



@app.route('/getSources', methods=['GET'])
def getSources():
    cur = mysql.connection.cursor()
    cur.execute('select id as sourceId, name from location')
    mysql.connection.commit()
   
    rows=cur.fetchall()
    result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    return {'result': result}

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)



def create_plot(data):
    df = pd.DataFrame(data)
    cities=df['city'].unique()
    
    
    graphs=[]
    for city in cities:
        cityData=df.loc[df['city']==city]
        graph = [
            go.Line(
                x=cityData['date'], # assign x as the dataframe column 'x'
                y=cityData['num_trips']
                )]
        graphs.append(graph)
   
    ids = [cities[i] for i, _ in enumerate(graphs)]
    
    
     # creating a sample dataframe


    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)
    

    return [graphJSON,ids]
    # https://dba.stackexchange.com/questions/37014/in-what-data-type-should-i-store-an-email-address-in-database
    # https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853