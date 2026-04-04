"""
Constantes de configuración de negocio (no secretas).

`CARBON_PRICE_EUR_PER_TONNE` es la fuente única para el default del motor y debe
alinearse con el front (`web/src/lib/ecotraceConstants.ts`). En runtime, los
endpoints usan `settings.carbon_price_eur_per_tonne` (sobreescribible vía env).
"""

CARBON_PRICE_EUR_PER_TONNE: float = 110.0
