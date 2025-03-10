from flask import Flask, render_template, request, redirect, url_for
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
from src.config import station_list, name_of_station

app = Flask(__name__)

# MongoDB connection string – replace the password/credentials as needed
MONGO_CONNECTION_STRING = "mongodb+srv://jim:lucky0218@cluster0.lqm6b.mongodb.net/"
client = MongoClient(MONGO_CONNECTION_STRING)
db = client["meteo"]
test_collection = db["test"]

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/by_station", methods=["GET", "POST"])
def by_station():
    data = []
    selected_station = None
    if request.method == "POST":
        # Retrieve selected station from the form
        try:
            selected_station = int(request.form.get("station"))
        except (ValueError, TypeError):
            selected_station = None

        if selected_station:
            # Query for the last 5 rows for this station, sorted by date descending
            data = list(
                test_collection.find({"Station": selected_station})
                .sort("Date", -1)
                .limit(50)
            )
            # Optionally reverse to show ascending order:
            data.reverse()

            # Format the date as a string for display
            for doc in data:
                doc["Date_str"] = doc["Date"].strftime("%Y-%m-%d")
    return render_template("by_station.html", data=data, selected_station=selected_station, station_list=station_list)

@app.route("/by_date", methods=["GET", "POST"])
def by_date():
    data = []
    chosen_date = None
    sort_order = request.args.get("sort", "asc")
    
    if request.method == "POST":
        date_str = request.form.get("date")
        if date_str:
            chosen_date = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    else:
        # Default to today if no date provided
        today = datetime.datetime.today()
        chosen_date = datetime.datetime(today.year, today.month, today.day)
    
    if chosen_date:
        # Query records for the chosen day for stations in station_list
        next_day = chosen_date + datetime.timedelta(days=1)
        data = list(
            test_collection.find({
                "Date": {"$gte": chosen_date, "$lt": next_day},
                "Station": {"$in": station_list}
            })
        )

        if sort_order == "desc":
            data.sort(key=lambda x: x.get("Avg", 0), reverse=True)
        else:
            data.sort(key=lambda x: x.get("Avg", 0))
        # Format dates for display
        for doc in data:
            doc["Date_str"] = doc["Date"].strftime("%Y-%m-%d")
            doc["Name"] = name_of_station[doc["Station"]]
    return render_template("by_date.html", data=data, chosen_date=chosen_date.strftime("%Y-%m-%d"), station_list=station_list)

if __name__ == "__main__":
    app.run(debug=True)
