from __future__ import annotations

import requests

from ..config import settings


CARBON_INTERFACE_ESTIMATES_URL = "https://www.carboninterface.com/api/v1/estimates"


def _transport_method(vehicle_type: str) -> str:
    v = (vehicle_type or "").lower().strip()
    if v in {"truck", "road"}:
        return "truck"
    if v in {"train", "rail"}:
        return "train"
    if v in {"plane", "air"}:
        return "plane"
    if v in {"ship", "sea", "ocean"}:
        return "ship"
    return "truck"


def estimate_shipping_co2_kg(*, weight_kg: float, distance_km: float, vehicle_type: str) -> float | None:
    """
    Returns kg CO2e from Carbon Interface when configured; otherwise None.
    """
    if not settings.carbon_interface_api_key:
        return None

    headers = {
        "Authorization": f"Bearer {settings.carbon_interface_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "type": "shipping",
        "attributes": {
            "weight_value": weight_kg,
            "weight_unit": "kg",
            "distance_value": distance_km,
            "distance_unit": "km",
            "transport_method": _transport_method(vehicle_type),
        },
    }

    try:
        resp = requests.post(CARBON_INTERFACE_ESTIMATES_URL, json=payload, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        # Carbon Interface responses include:
        # data.attributes.carbon_kg (and/or carbon_g)
        return float(data["data"]["attributes"]["carbon_kg"])
    except Exception:
        return None


EMISSION_FACTORS: dict[str, float] = {
    "plane": 0.500,
    "truck": 0.105,
    "train": 0.025,
    "ship":  0.012,
    "default": 0.120,
}


def fallback_co2_kg(
    *,
    weight_kg: float,
    distance_km: float,
    vehicle_type: str = "default",
) -> tuple[float, float]:
    """
    ISO 14064-aligned deterministic fallback.
    Returns (co2_kg, emission_factor_used).
    """
    v = (vehicle_type or "").lower().strip()
    ef = EMISSION_FACTORS.get(v, EMISSION_FACTORS["default"])
    tonnes = weight_kg / 1000.0
    return distance_km * tonnes * ef, ef

