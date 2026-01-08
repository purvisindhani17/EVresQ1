from flask import Flask, request, jsonify
import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)



from model.model import rescue_request, reset_driver

app = Flask(__name__)

# -------------------------------
# Health Check
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "EVRESQ API running",
        "message": "Backend is live"
    })


# -------------------------------
# Rescue Request API
# -------------------------------
@app.route("/rescue", methods=["POST"])
def rescue():
    data = request.get_json()

    if not data:
        return jsonify({"status": "ERROR", "message": "JSON body required"}), 400

    ev_lat = data.get("ev_lat") or data.get("latitude")
    ev_lon = data.get("ev_lon")

    result = rescue_request(ev_lat, ev_lon)
    return jsonify(result)


# -------------------------------
# Driver Reset API
# -------------------------------
@app.route("/reset_driver", methods=["POST"])
def reset():
    data = request.get_json()

    if not data or "driver_id" not in data:
        return jsonify({"status": "ERROR", "message": "driver_id required"}), 400

    driver_id = data["driver_id"]
    result = reset_driver(driver_id)
    return jsonify(result)


# -------------------------------
# Run Server
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
