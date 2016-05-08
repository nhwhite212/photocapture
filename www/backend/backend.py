# AUTHOR ChiaLing Wang cw2189@nyu.edu

from flask.ext.cors import CORS , cross_origin
from flask import Flask, request, jsonify
from flaskext.mysql import MySQL


from metamind.api import set_api_key, food_image_classifier
import urllib2
import os
import json
import time 

set_api_key('R71f8xzpv9EHlNH1HZbYfKFWks80ceLTQOPMoynY0mV3KR7Q0j')
app = Flask(__name__)
CORS(app)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'websysS16GB4'
app.config['MYSQL_DATABASE_PASSWORD'] = 'websysS16GB4!!'
app.config['MYSQL_DATABASE_DB'] = 'websysS16GB4'
app.config['MYSQL_DATABASE_HOST'] = 'websys3.stern.nyu.edu'
mysql.init_app(app)



''''''''''''''''''''''''''''''''''''''
'''        Login  Check            '''
''''''''''''''''''''''''''''''''''''''
@app.route("/login/" , methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def login():
   data = {}
   
   db = mysql.connect()

   cur = db.cursor()
   cur.execute("show tables")
   print(cur.fetchall())

   _password = request.form['password']
#   _password.encode('base64')

   _email = request.form['email']

   exe_sql = "select name from User where email = '%s' and password = '%s'" %(_email , _password)
   print exe_sql
   cur.execute(exe_sql)
   result = cur.fetchone()
   print(result)
   if result is not None:
        data['name'] = result
	exe_sql1 = "select calories from User where email = '%s'" %(_email)
        cur.execute(exe_sql1)
        
	result1 = cur.fetchone()
        print(result1)
	data['calories'] = result1
   else:
        print("ERROR")
        return jsonify({'error':True})

   #data['calories'] = _calories
   return jsonify(data)



''''''''''''''''''''''''''''''''''''''
'''   Food Image Recognization API '''
''''''''''''''''''''''''''''''''''''''
@app.route("/get/" , methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])

def get():
    data = {}
    url = str(request.form['image'])
    print url
#    temp = food_image_classifier.predict(url , input_type='urls')
#    print temp[0]
#    print temp[0]['label']
#    data['name'] = temp[0]['label']
#    print data['name']

    query = "https://api.clarifai.com/v1/tag/?url="+url+"&access_token=8e9L6uKF5CVKQDi3jTRvHIY9xZ8rnf"
    print query
    result_food = urllib2.urlopen(query)
    result_food_json = json.load(result_food)
    print result_food_json["results"][0]["result"]["tag"]["classes"]
    data['name'] = result_food_json["results"][0]["result"]["tag"]["classes"][0]

    calories_api = "https://api.nutritionix.com/v1_1/search/" +	 data['name'] +	"?results=0:20&fields=item_name,brand_name,item_id,nf_calories&appId=da89af13&appKey=edc5e0fcc4410456805bffb37c41b643";
    
    result = urllib2.urlopen(calories_api)
    result_json = json.load(result)
    print "The detail"
    
    print result_json['hits'][0]['fields']['nf_calories']
    data['calories'] = result_json['hits'][0]['fields']['nf_calories']

    return jsonify(data)
    #title = str(reuqest.json['title'])+"_new"
    #article = str(request.json['article'])+"_new"
    #return jsonify(title = title , articel=article)


''''''''''''''''''''''''''''''''''''''
'''           Image Upload         '''
''''''''''''''''''''''''''''''''''''''
@app.route("/upload/" , methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])

def upload():
    #name = request.form['name']
    base64_string = request.form['image']
    
    print time.time()
    filename = "image_%s.png" %( str(time.time()).replace('.' , '_'))
    print filename
    cur = os.getcwd()
    photo_path = os.path.join(cur , "photo")
    fh = open(os.path.join(photo_path , filename) , "wb")
    fh.write(base64_string.decode('base64'))
    fh.close()
    return jsonify({'success':True , 'name' : filename})
    




''''''''''''''''''''''''''''''''''''''
'''           Sign up              '''
''''''''''''''''''''''''''''''''''''''
@app.route("/signup/" , methods=["POST"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def sign():
   print("In function")
   data = {}
   db = mysql.connect()
   
   cur = db.cursor()
   cur.execute("show tables")
   print(cur.fetchall())  
   _name = str(request.form['name'])
   
   _password = request.form['password']
#   _password.encode('base64')

   _email = request.form['email']
   _BOD = float(request.form['bday'])
   _age = float(request.form['age'])
   _gender = request.form['gender']
   _weight = float(request.form['weight'])
   _height = float(request.form['height'])
   _calories = float(request.form['calories'])
   
   data['name'] = _name
   data['calories'] = _calories
   data['age'] = _age
   data['BOD'] = _BOD
   #print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(_BOD))
   print data
   #cur.execute( 'INSERT INTO try VALUES (null , "%s") , (_name)')
   
   try:
	exe_sql = "INSERT INTO User VALUES (null , '%s' , '%s' , '%s' , %0.2f , %0.2f , '%s' , %0.2f , %0.2f , %0.2f)" % (_name , _email , _gender , _age , _BOD , _password , _height , _weight, _calories) 
   	print exe_sql
   	cur.execute(exe_sql)
   	db.commit()
   except:
	print("ERROR")
        return jsonify({'error':True})

   #data['calories'] = _calories
   return jsonify(data)



def validate_exist(email , cur):
    print "validating..."
    my_query = "Select uid from User where email = '%s'" %(email)
    cur.execute(my_query)
    print cur.fetchall()



@app.route("/")
def hello():
    return "hello"
    #title = str(reuqest.json['title'])+"_new"
    #article = str(request.json['article'])+"_new"
    #return jsonify(title = title , articel=article)
'''
def cors_header(resp):
	resp.headers['Access-Control-Allow-Origin'] = '*'
	if request.method == 'OPTIONS':
		resp.headers['Access-Control-Allow-Methods'] = 'DELETE , GET , POST , PUT'
		headers = request.headers.get('Access-Control-Request-Headers')
		if headers :
			resp.headers['Access-Control-Allow-Headers'] = headers
	return resp
app.after_request(cors_header)
'''


if __name__ == "__main__":
    app.run(
        host='0.0.0.0', 
        port=7004, 
        debug=True)
