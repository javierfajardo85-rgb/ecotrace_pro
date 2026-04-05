"""
Shopify Admin API hooks for monthly return / order counts by category.

Not wired by default: returns empty dicts until you set credentials and implement
GraphQL queries. Use `monthly_category_returns` + manual import or your ETL instead.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    pass


def fetch_orders_by_category_shopify(_merchant_public_id: str, _year_month: str) -> dict[str, int]:
    """
    Planned: GraphQL orders(created_at range) + line items + product metafield category.
    """
    return {}


def fetch_returns_by_category_shopify(_merchant_public_id: str, _year_month: str) -> dict[str, int]:
    """
    Planned: Refunds / Return objects in the same window, mapped to product categories.
    """
    return {}
