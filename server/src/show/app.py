from flask import Flask, json, render_template, request
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
from config import station_list

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# MongoDB connection string – replace the password/credentials as needed
MONGO_CONNECTION_STRING = "mongodb+srv://jim:lucky0218@cluster0.lqm6b.mongodb.net/"
client = MongoClient(MONGO_CONNECTION_STRING)
db = client["meteo"]
test_collection = db["test"]

@app.route("/", methods=["GET"])
def server():
    return render_template("server.html")

@app.route("/by_station", methods=["GET"])
def by_station():
    if request.method == "GET":
        selected_station = request.args.get("station")
        start_date = request.args.get("start")
        end_date = request.args.get("end")

        if not selected_station:
            return jsonify({"error": "Station parameter is required"}), 400

        try:
            selected_station = int(selected_station)

            query = {"Station": selected_station}

            # Add date range filter if both start_date and end_date are provided
            if start_date or end_date:
                try:
                    if start_date:
                        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
                        query["Date"] = {"$gte": start_date}
                    if end_date:
                        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
                        if "Date" in query:
                            query["Date"]["$lte"] = end_date
                        else:
                            query["Date"] = {"$lte": end_date}
                except ValueError as e:
                    return json.jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

            data = list(test_collection.find(query).sort("Date", -1))
            data.reverse()

            # Remove redundant results based on Station and Date
            unique_data = []
            seen = set()
            for doc in data:
                key = (doc["Station"], doc["Date"].strftime("%Y-%m-%d")) 
                if key not in seen:
                    seen.add(key)
                    unique_data.append(doc)

            if not unique_data:
                return json.jsonify({"error": "No data found for the provided date range"}), 404

            # Prepare the response
            response = [{
                "Avg": doc["Avg"],
                "Date": doc["Date"].strftime("%Y-%m-%d"),
                "FDAvg": doc["FDAvg"],
                "Station": doc["Station"],
                "_id": str(doc["_id"]),
            } for doc in unique_data]

            return json.jsonify(response)

        except Exception as e:
            return json.jsonify({"error": str(e)}), 500
    else:
        return json.jsonify({"error": "Invalid request method"}), 405

@app.route("/by_date", methods=["GET"])
def by_date():
    if request.method == "GET":
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
    else:
        return json.jsonify({"error": "Invalid request method"}), 405

if __name__ == "__main__":
    app.run(debug=True)
