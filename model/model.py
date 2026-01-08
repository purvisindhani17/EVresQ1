import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors


import os
import threading
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(
    BASE_DIR,
    "data",
    "ev_charging_stations_delhi_cleaned.csv"
)

EARTH_RADIUS_KM = 6371
MAX_SEARCH_DRIVERS = 5
df = pd.read_csv(DATA_PATH)

df["state"] = df["state"].str.strip().str.lower()
df = df[df["state"] == "delhi"].reset_index(drop=True)

stations = df[["latitude", "longitude"]].dropna().reset_index(drop=True)
station_coords = stations.values
station_coords_rad = np.radians(station_coords)


station_knn = NearestNeighbors(
    n_neighbors=2,
    metric="haversine"
)
station_knn.fit(station_coords_rad)


np.random.seed(42)
num_drivers = 150
driver_data = []

for i in range(num_drivers):
    idx = np.random.randint(len(station_coords))
    lat1, lon1 = station_coords[idx]

    _, neighbors = station_knn.kneighbors(
        [station_coords_rad[idx]], n_neighbors=2
    )
    lat2, lon2 = station_coords[neighbors[0][1]]

    # midpoint + small noise
    noise = 0.002
    driver_lat = (lat1 + lat2) / 2 + np.random.uniform(-noise, noise)
    driver_lon = (lon1 + lon2) / 2 + np.random.uniform(-noise, noise)

    driver_data.append([
        f"D{i+1}",
        driver_lat,
        driver_lon,
        1  # available
    ])

drivers = pd.DataFrame(
    driver_data,
    columns=["driver_id", "latitude", "longitude", "available"]
)
drivers["base_lat"] = drivers["latitude"]
drivers["base_lon"] = drivers["longitude"]

driver_coords_rad = np.radians(drivers[["latitude", "longitude"]].values)

driver_knn = NearestNeighbors(
    n_neighbors=MAX_SEARCH_DRIVERS,
    metric="haversine"
)
driver_knn.fit(driver_coords_rad)


rescue_log = []


def validate_input(lat, lon):
    return (
        isinstance(lat, (int, float)) and
        isinstance(lon, (int, float)) and
        -90 <= lat <= 90 and
        -180 <= lon <= 180
    )


def assign_driver_to_ev(ev_lat, ev_lon):
    ev_coords_rad = np.radians([[ev_lat, ev_lon]])

    distances, indices = driver_knn.kneighbors(ev_coords_rad)

    for idx, dist in zip(indices[0], distances[0]):
        driver = drivers.iloc[idx]

        if driver["available"] == 1:
            distance_km = dist * EARTH_RADIUS_KM
            rescue_probability = max(0.0, 1 - distance_km / 10)

            # mark driver unavailable

            drivers.at[idx, "available"] = 0

            threading.Thread(
                target=auto_reset_driver,
                args=(drivers.at[idx, "driver_id"],),
                daemon=True
            ).start()

            return {
                "status": "DRIVER_ASSIGNED",
                "driver_id": driver["driver_id"],
                "driver_lat": driver["latitude"],
                "driver_lon": driver["longitude"],
                "distance_km": round(distance_km, 2),
                "rescue_probability": round(rescue_probability, 2)
            }

    return {"status": "NO_DRIVER_AVAILABLE"}


def rescue_request(ev_lat, ev_lon):
    try:
        ev_lat = float(ev_lat)
        ev_lon = float(ev_lon)
    except (TypeError, ValueError):
        return {"status": "INVALID_LOCATION"}

    if not validate_input(ev_lat, ev_lon):
        return {"status": "INVALID_LOCATION"}

    result = assign_driver_to_ev(ev_lat, ev_lon)

    rescue_log.append({
        "ev_lat": ev_lat,
        "ev_lon": ev_lon,
        "driver_id": result.get("driver_id"),
        "distance_km": result.get("distance_km"),
        "probability": result.get("rescue_probability"),
        "status": result["status"]
    })

    return result


def reset_driver(driver_id):
    idx = drivers.index[drivers["driver_id"] == driver_id]

    if len(idx) == 0:
        return {"status": "INVALID_DRIVER"}

    idx = idx[0]

    drivers.at[idx, "latitude"] = drivers.at[idx, "base_lat"]
    drivers.at[idx, "longitude"] = drivers.at[idx, "base_lon"]
    drivers.at[idx, "available"] = 1

    return {
        "status": "DRIVER_RESET",
        "driver_id": driver_id
    }

def auto_reset_driver(driver_id, delay=10):
    time.sleep(delay)
    reset_driver(driver_id)



