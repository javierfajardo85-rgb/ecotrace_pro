from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Requirement:
    code: str
    description: str
    required_scopes: set[int]
    required_fields: set[str]


# MVP: a minimal CSRD-style checklist, intentionally conservative.
CSRD_MVP_REQUIREMENTS: list[Requirement] = [
    Requirement(
        code="CSRD-SCOPE-1",
        description="Scope 1 emissions coverage",
        required_scopes={1},
        required_fields={"scope", "category"},
    ),
    Requirement(
        code="CSRD-SCOPE-2",
        description="Scope 2 emissions coverage (location/market-based captured via category/metadata)",
        required_scopes={2},
        required_fields={"scope", "category"},
    ),
    Requirement(
        code="CSRD-SCOPE-3",
        description="Scope 3 emissions coverage (spend-based estimates for MVP)",
        required_scopes={3},
        required_fields={"scope", "category", "spend_amount", "spend_currency"},
    ),
    Requirement(
        code="CSRD-DATA-QUALITY",
        description="Data quality levels and confidence scores present",
        required_scopes={1, 2, 3},
        required_fields={"data_quality_level", "confidence_score"},
    ),
]

