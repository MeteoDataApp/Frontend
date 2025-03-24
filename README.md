## About
This is a website for meteorology enthusiasts to monitor & compare daily average & seasonal changes!

## How to deploy
Prerequisite: python3.10, pip, git. Tested on Windows 11.
Recommended to have conda installed, for easier environment management.
```bash
git clone https://github.com/lucky0218/meteo.git
git checkout -b your_branch
pip install uv
cd server
uv sync
.venv\Scripts\activate
uv pip install .
cd src
uv run server
```
Check `localhost:5000` to see the website.

## `integrate` branch
Application runs on Vite-based React Frontend and Flask Backend.

### Run the Frontend Server
1.) `cd client`

2.) `npm i`

3.) `npm run dev`

---

Frontend URL: `localhost:5173`

Backend URL: `localhost:5000`

### API Documentation

This document provides detailed information about the API endpoints available in the Flask application. It includes endpoint purposes, request methods, query parameters, response formats and sample outputs.

---

#### Overview

The API is built using Flask and connects to a MongoDB database (`meteo`) with a collection named `test`. It is designed to serve meteorological data and supports Cross-Origin Resource Sharing (CORS) with the allowed origin set to `http://localhost:5173`.

The application includes three main endpoints:

- **Root Endpoint (`/`)**: Serves a static HTML page about the server status.
- **By Station Endpoint (`/by_station`)**: Retrieves weather data filtered by a specific station.
- **By Date Endpoint (`/by_date`)**: Retrieves weather data filtered by a specific date.
- **Advanced Analysis Endpoint (`/advancedAnalysis`)**: Retrieves weather data filtered by a specific date and as well as a range of stations.
---

## Helper Functions

```
def handle_api_error(e, message="Internal server error"):
    app.logger.error(f"Error: {str(e)}")
    return json.jsonify({
        "success": False,
        "error": message
    }), 500
```

This function serves to help abstract returning 500 errors from other endpoints.

---

```
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
```

This decorator function serves to help render the custom 404 Page when a unregistered route has been hit.


## Endpoints

### 1. Root Endpoint

#### Purpose
- To serve the HTML page (`server.html`) which shows the current status of the Backend Server.

#### Request
- **URL:** `/` 
- **Method:** `GET`  
- **Parameters:** None

#### Response
- **Content:** HTML content rendered from the `server.html` template.
- **HTTP Status Code:** `200 OK` on success.

---

### 2. Get Weather Data by Station

#### Purpose
- Retrieves the weather records for a specific station from the database. The results are returned in chronological order (oldest first after reversing).

#### Request
- **URL:** `/by_station` 
- **Method:** `GET`  
- **Parameters:** station

#### Query Parameters
- **station** (required)
  - **Type:** Integer (passed as a string in the query and then converted to an integer)
  - **Description:** The unique identifier for the station. This parameter is used to filter the records in the database.

#### Error Handling
`400 Bad Request`: If the `station` argument was not received, the server responds with `400 Bad Request`.

`405 Method Not Allowed`: If the server receives an unrecognised HTTP/S Method, it responds with `405 Method Not Allowed`

`500 Internal Server Error`: If the server fails to construct the JSON Response, the server responds with `500 Internal Server Error`

#### Behavior
- The server queries the MongoDB collection for documents where the `Station` field matches the provided value.
- The query results are sorted in descending order by the `Date` field to capture the most recent records.
- The result set is ordered from oldest to newest.

#### Success Response
- **Content-Type:** `application/json`
- **HTTP Status Code:** `200 OK`
- **Response Body:** A JSON object with:
  - `success`: Boolean (True on success)
  - `data`:
    - `Avg`: Average measurement value.
    - `Date`: Date of the measurement, formatted as `"YYYY-MM-DD"`.
    - `FDAvg`: FDAverage value (context-specific).
    - `Station`: Station identifier.
    - `_id`: Document identifier as a string.
  

**Example Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "Avg": 23.5,
      "Date": "2023-03-01",
      "FDAvg": 22.8,
      "Station": 101,
      "_id": "640c1234abcd5678efgh"
    },
    {
      "Avg": 24.1,
      "Date": "2023-03-02",
      "FDAvg": 23.0,
      "Station": 101,
      "_id": "640c2345bcde6789fghi"
    }
  ]
}
```

### 3. Get Weather Data by Date

**URL:** `/by_date`  
**Method:** `GET`

#### Purpose
Retrieves all records for a given date from the database, filtering only those records whose `Station` field is part of `station_list`.

#### Request
- **URL:** `/by_date` 
- **Method:** `GET`  
- **Parameters:** date

#### Query Parameters
- **`date`** (required)
  - **Type:** String
  - **Format:** `"YYYY-MM-DD"`
  - **Description:** The date for which records should be retrieved. The endpoint extracts records where the `Date` field matches the requested date.

#### Error Handling
`400 Bad Request`: If the `date` argument was not received, the server responds with `400 Bad Request`.

`405 Method Not Allowed`: If the server receives an unrecognised HTTP/S Method, it responds with `405 Method Not Allowed`

`500 Internal Server Error`: If the server fails to construct the JSON Response, the server responds with `500 Internal Server Error`

#### Behavior
- The server parses the provided date string into a datetime object.
- The MongoDB query filters documents where:
  - The `Date` field of the document matches the requested date

#### Success Response
- **Content-Type:** `application/json`
- **HTTP Status Code:** `200 OK`
- **Response Body:** A JSON object with:
  - `success`: Boolean (True on success)
  - `data`:
    - `Avg`: Average measurement value.
    - `Date`: Date of the measurement, formatted as `"YYYY-MM-DD"`.
    - `FDAvg`: FDAverage value.
    - `Station`: Station identifier.
    - `_id`: Document identifier as a string.

**Example Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "Avg": 22.0,
      "Date": "2023-04-15",
      "FDAvg": 21.5,
      "Station": 102,
      "_id": "640cabcd1234efgh5678"
    },
    {
      "Avg": 30.0,
      "Date": "2023-04-16",
      "FDAvg": 19.5,
      "Station": 105,
      "_id": "046cabcd4321hgfe8765"
    }
  ]
}
```

### 4. Advanced Analysis (For Search by Date)

**URL:** `/advancedAnalysis`  
**Method:** `POST`

#### Purpose
Retrieves historical weather analytics for a range of specified stations, on a specific date. The response is used to construct a graph using ChartJS for advanced analysis.

#### Request
- **URL:** `/advancedAnalysis` 
- **Method:** `POST`  
- **Arguments:** `stations` and `date`

#### Arguments
- **`stations`** (required)
  - **Type:** List
  - **Description:** A list of stations for which the server should filter records by.

- **`date`** (required)
  - **Type:** String
  - **Format:** `"YYYY-MM-DD"`
  - **Description:** The date for which records should be retrieved. The endpoint extracts records where the `Date` field matches the requested date.

#### Error Handling
`400 Bad Request`: If the `date` or `stations` argument was not received, the server responds with `400 Bad Request`.

`405 Method Not Allowed`: If the server receives an unrecognised HTTP/S Method, it responds with `405 Method Not Allowed`

`500 Internal Server Error`: If the server fails to construct the JSON Response, the server responds with `500 Internal Server Error`

#### Behavior
- The server parses the provided date string into a datetime object.
- The MongoDB query filters documents where:
  - The `Date` field of the document matches the requested date
  - The `Station` field of the document is in the list of requested stations

#### Success Response
- **Content-Type:** `application/json`
- **HTTP Status Code:** `200 OK`
- **Response Body:** A JSON object with:
  - `success`: Boolean (True on success)
  - `data`:
    - `Avg`: Average measurement value.
    - `Station`: Station identifier.
    - `Date`: Date of the measurement, formatted as `"YYYY-MM-DD"`.

**Example Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "Avg": 22.5,
      "Station": 101,
      "Date": "2023-05-01"
    },
    {
      "Avg": 23.1,
      "Station": 102,
      "Date": "2023-05-01"
    }
  ]
}
```

### Database Schema
```json
[
  {
    "Avg": <float>,
    "Date": <datetime>,
    "FDAvg": <float>,
    "Station": <int>,
    "_id": <str>
  }
]
```

**Documentation written by [Joshua](https://github.com/Sadliquid) and [Lincoln](https://github.com/lincoln0623)**

**API Documentation and Database Schema Last Updated on `24 March 2025 10:57 AM`**
