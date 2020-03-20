from flask import Flask, render_template, request,render_template, jsonify,render_template_string
from flask_mysqldb import MySQL
from flask_cors import CORS
import plotly
import plotly.graph_objs as go

import pandas as pd
import json


app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'akshay@1024'
app.config['MYSQL_DB'] = 'Cloud_5409'

mysql = MySQL(app)


@app.route('/')
def hello():
    
    return render_template("invoice.html")

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
    return render_template_string(res)


@app.route('/getBuses/<sourceId>/<destId>',methods=['GET'])
def get_invoice(sourceId,destId):
    cur = mysql.connection.cursor()
    # cur.execute('select id,bus_no, arr_time,dep_time,capacity - num_bookings as seats from bus where source_id=%s and dest_id=%s and capacity <> num_bookings' %(sourceId,destId))
    cur.execute('''select b.id, l1.id as src_id, l2.id as dest_id ,l1.address as src,l2.address as dest,bus_no, arr_time,dep_time,(capacity - num_bookings) 
    as seats, b.price from bus b INNER JOIN location l1 ON l1.id=b.source_id INNER JOIN location l2 ON l2.id=b.dest_id 
    where source_id=%s and dest_id=%s and capacity <> num_bookings''' %(sourceId,destId))
    mysql.connection.commit()
    rows=cur.fetchall()
    result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    return jsonify({'result': result})



@app.route('/getSources', methods=['GET'])
def getSources():
    cur = mysql.connection.cursor()
    cur.execute('select id as sourceId, name from location')
    mysql.connection.commit()
    rows=cur.fetchall()
    result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
    cur.close()
    return jsonify({'result': result})


@app.route('/registration/', methods=['POST'])
def insertUserDetails():
    data = request.get_json()
    cur = mysql.connection.cursor()
    cur.execute(
        'insert into users (name, email, password, dob, sex) values (%s,%s,%s,%s,%s)',(data['name'],data['email'],data['password'],data['dob'],data['sex']))
    mysql.connection.commit()
    cur.close()
    return {'response':"Data successfully inserted in DB"}


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
    graphJSON = json.dumps(graphs, cls=plotly.utils.PlotlyJSONEncoder)
    return [graphJSON,ids]


def createInvoice(id, total):
    cur=mysql.connection.cursor()
    date=pd.to_datetime('today')#.strftime('%Y-%m-%d')
    time=pd.Timestamp('today')
    cur.execute("INSERT INTO invoice (`trip_id`, `date`, `time`, `amount`) VALUES (%s, %s, %s, %s)",(id,date,time,total))    
    invoice_id = cur.lastrowid
    mysql.connection.commit()
    cur.close()
    return invoice_id
	
@app.route('/makePayment',methods=['POST'])
def validate_card():
    user_id=(request.form['userId'])
    source_id=(request.form['source_id'])
    dest_id=(request.form['dest_id'])
    bus_id=request.form['bus_id']
    price=float(request.form["price"])
    date=request.form['date']
    num_passengers=(request.form['numPass'])
    
    cardNumber=request.form["cardNumber"]
    cardName=request.form["cardName"]
    expiryDate=request.form["expiryDate"]
    cardCVV=request.form["cvCode"]
    
    if(validateCard(cardNumber,expiryDate,cardCVV)):
        
        cur=mysql.connection.cursor()
        cur.execute('''INSERT INTO `trips` ( `user_id`, `source_id`, `dest_id`, `date`,  `num_passengers`, `bus_id`) VALUES (%s, %s, %s, %s,  %s, %s)''',(user_id,source_id,dest_id,date,num_passengers,bus_id))
        trip_id = cur.lastrowid
        cur.execute(''' UPDATE bus SET num_bookings = num_bookings+%s WHERE id = %s''',(num_passengers,bus_id))
        mysql.connection.commit()
        invoice_id=createInvoice(trip_id, (float(num_passengers)*price))
        cur.execute(""" select t.date as travel_date,u.name as user,i.date as booking_date ,l1.address  as source, l2.address as destination , t.num_passengers, b.bus_no, b.arr_time, b.dep_time, b.price as unit_price, i.amount as total from  invoice i 
        inner join trips t on t.id=i.trip_id 
        inner join bus b on b.id=t.bus_id 
        inner join location l1 on l1.id=t.source_id 
        inner join location l2 on l2.id=t.dest_id
        inner join users u on t.user_id=u.id 
        where i.invoice_no="""+str(invoice_id))
        rows=cur.fetchall()
        result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
        print(result)
        return render_template("invoice.html", invoice_id=invoice_id, result=result[0])
    else:
        return 'Payment failed. Please check your card details.'

@app.route('/mobileMakePayment',methods=['POST'])
def mobile_validate_card():
    user_id=(request.form['userId'])
    source_id=(request.form['source_id'])
    dest_id=(request.form['dest_id'])
    bus_id=request.form['bus_id']
    price=float(request.form["price"])
    date=request.form['date']
    num_passengers=(request.form['numPass'])
    
    cardNumber=request.form["cardNumber"]
    cardName=request.form["cardName"]
    expiryDate=request.form["expiryDate"]
    cardCVV=request.form["cvCode"]
    
    if(validateCard(cardNumber,expiryDate,cardCVV)):
        
        cur=mysql.connection.cursor()
        cur.execute('''INSERT INTO `trips` ( `user_id`, `source_id`, `dest_id`, `date`,  `num_passengers`, `bus_id`) VALUES (%s, %s, %s, %s,  %s, %s)''',(user_id,source_id,dest_id,date,num_passengers,bus_id))
        trip_id = cur.lastrowid
        cur.execute(''' UPDATE bus SET num_bookings = num_bookings+%s WHERE id = %s''',(num_passengers,bus_id))
        mysql.connection.commit()
        invoice_id=createInvoice(trip_id, (float(num_passengers)*price))
        cur.execute(""" select t.date as travel_date,u.name as user,i.date as booking_date ,l1.address  as source, l2.address as destination , t.num_passengers, b.bus_no, b.arr_time, b.dep_time, b.price as unit_price, i.amount as total from  invoice i 
        inner join trips t on t.id=i.trip_id 
        inner join bus b on b.id=t.bus_id 
        inner join location l1 on l1.id=t.source_id 
        inner join location l2 on l2.id=t.dest_id
        inner join users u on t.user_id=u.id 
        where i.invoice_no="""+str(invoice_id))
        rows=cur.fetchall()
        #result = [dict(zip([key[0] for key in cur.description], row)) for row in rows]
        #print(result)
        return jsonify(rows)
    else:
        return jsonify(0)
		

def validateCard(cardNumber,cardDate,cardCVV):
    return (cardNumber=="1111111111111111" and cardDate=="00/00" and cardCVV=="999")
         

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)




	


# @app.route('/alterBus/<sourceID>/<destID>/<numPass>',methods=['GET'])
# def alter_bus(sourceID,destID,numPass):
# 	cur=mysql.connection.cursor()
# 	cur.execute("select num_bookings from cloudproject.bus where source_id=%s and dest_id=%s;",(sourceID,destID))
# 	rv=cur.fetchall()#get current number of bookings
# 	new_num_bookings=int(rv[0][0])+int(numPass)
# 	cur.execute("update cloudproject.bus set num_bookings=%s where source_id=%s and dest_id=%s;",(new_num_bookings,sourceID,destID))
# 	mysql.connection.commit()
# 	cur.close()
# 	return jsonify(1)
	


	
# @app.route('/alterInvoice/<totalamount>',methods=['GET'])
# def alter_invoice(totalamount):
# 	cur=mysql.connection.cursor()
# 	cur.execute("select id from cloudproject.trip order by id desc limit 1;")
# 	rv=cur.fetchall()#get current number of bookings
# 	trip_id=int(rv[0][0])
# 	now=datetime.now()
# 	date= now.strftime("%d-%m-%Y")
# 	time=now.strftime("%H:%M:%S")
# 	invoice="invoice_"+str(randint(100,999))
# 	cur.execute("insert into cloudproject.invoice values (%s,'"+date+"','"+time+"',%s,'"+invoice+"');",(trip_id,totalamount))
# 	mysql.connection.commit()
# 	cur.close()
# 	return jsonify(1)


    # https://dba.stackexchange.com/questions/37014/in-what-data-type-should-i-store-an-email-address-in-database
    # https://medium.com/@PyGuyCharles/python-sql-to-json-and-beyond-3e3a36d32853