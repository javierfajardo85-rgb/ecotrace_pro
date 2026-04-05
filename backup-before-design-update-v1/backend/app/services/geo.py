import math


# Tiny built-in ZIP→(lat,lon) sample so the demo works out-of-box.
# For production, replace with a real ZIP dataset or geocoding provider.
ZIP_COORDS: dict[str, tuple[float, float]] = {
    "10001": (40.7506, -73.9972),  # New York, NY
    "90001": (33.9739, -118.2487),  # Los Angeles, CA
    "60601": (41.8853, -87.6216),  # Chicago, IL
    "94105": (37.7898, -122.3942),  # San Francisco, CA
    "33101": (25.7751, -80.1947),  # Miami, FL
}


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return r * c


def coords_for_zip(zip_code: str) -> tuple[float, float] | None:
    z = (zip_code or "").strip()
    return ZIP_COORDS.get(z)

