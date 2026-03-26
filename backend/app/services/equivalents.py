def kgco2_to_smartphone_charges(kg_co2: float) -> int:
    # 1kg ≈ 120 charges
    return int(round(max(0.0, kg_co2) * 120))


def kgco2_to_tree_days(kg_co2: float) -> int:
    # 1kg ≈ 15 days of a mature tree
    return int(round(max(0.0, kg_co2) * 15))

