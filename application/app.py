#Import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import and_, or_
import pandas as pd

#Import Flask
from flask import Flask, jsonify, render_template


#Database Setup
engine = create_engine("sqlite:///../Resources/sqlite/nbaData.sqlite")
conn = engine.connect()
Players = pd.read_sql("Select * FROM Players", conn)
Race = pd.read_sql("Select * FROM NBA_Race", conn)
Counties = pd.read_sql("Select * FROM us_players_counties", conn)
Poverty = pd.read_sql("Select * FROM us_poverty", conn)

#Reflect existing database
Base = automap_base()

#Reflect tables
# Base.prepare(engine, reflect=True)
# print(Base.classes.keys())
# print("hello")
#Save references to the tables
# Players = Base.classes.Players
# Race = Base.classes.NBA_Race
# Counties = Base.classes.us_players_counties
# Poverty = Base.classes.us_poverty

#Flask Setup
app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")
   
@app.route("/race")
def race():
    return render_template("tableaunbademo.html")
    
@app.route("/poverty")
def economic():
    return render_template("poverty.html")

@app.route('/api/all_players')
def all_player():
    return Players.to_json(orient='records')

@app.route('/api/race')
def race_data():
    return Race.to_json(orient='records')

@app.route('/api/counties')
def county_data():
    return Counties.to_json(orient='records')

@app.route('/api/poverty')
def poverty_data():
    return Poverty.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True)
