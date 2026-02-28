# inference.py

from .rules import RULES

def infer_risk(facts):
    explanations = []
    riskPorcentaje = 0

    for rule in RULES:
        try:
            if rule["condition"](facts):
                riskPorcentaje += rule["impact"]
                explanations.append(rule["explanations"])
        except Exception:
            pass

    riskPorcentaje = min(riskPorcentaje, 100)
    return riskPorcentaje, explanations