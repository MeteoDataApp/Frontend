from flask import Flask, render_template, request, redirect, url_for, json
from flask_cors import CORS
from pymongo import MongoClient
import datetime
import os
import sys

# Get the absolute path of the current file (app.py)
current_file = os.path.abspath(__file__)
# Get the directory containing app.py (ds)
current_dir = os.path.dirname(current_file)
# Get the parent directory (project)
parent_dir = os.path.dirname(current_dir)
# Add the parent directory to sys.path
sys.path.append(parent_dir)

# Import station_list from config.py
from config import station_list, name_of_station

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# MongoDB connection string – replace the password/credentials as needed
MONGO_CONNECTION_STRING = "mongodb+srv://jim:lucky0218@cluster0.lqm6b.mongodb.net/"
client = MongoClient(MONGO_CONNECTION_STRING)
db = client["meteo"]
test_collection = db["test"]

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/by_station", methods=["GET"])
def by_station():
    selected_station = request.args.get("station")
    if not selected_station:
        return json.jsonify({"error": "Station parameter is required"}), 400

    try:
        data = list(test_collection.find({"Station": int(selected_station)})
            .sort("Date", -1)
            .limit(50)
        )
        data.reverse()
        return json.jsonify([{
            "Avg": doc["Avg"],
            "Date": doc["Date"].strftime("%Y-%m-%d"),
            "FDAvg": doc["FDAvg"],
            "Station": doc["Station"],
            "_id": str(doc["_id"]),
        } for doc in data])
    except Exception as e:
        return json.jsonify({"error": str(e)}), 500

@app.route("/by_date", methods=["GET"])
def by_date():
    date_str = request.args.get("date")
    if not date_str:
        return json.jsonify({"error": "Date parameter is required"}), 400

    try:
        chosen_date = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        next_day = chosen_date + datetime.timedelta(days=1)
        data = list(test_collection.find({
            "Date": {"$gte": chosen_date, "$lt": next_day},
            "Station": {"$in": station_list}
        }))
        
        return json.jsonify([{
            "Avg": doc["Avg"],
            "Date": doc["Date"].strftime("%Y-%m-%d"),
            "FDAvg": doc["FDAvg"],
            "Station": doc["Station"],
            "_id": str(doc["_id"]),
        } for doc in data])
    except Exception as e:
        return json.jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
