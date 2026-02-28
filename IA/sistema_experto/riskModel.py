# riskModel.py

from .facts import FACTS
from .inference import infer_risk

def predict_risk(historial):
    """
    Recibe un dict con datos clínicos:
    e.g. {
      "edad": 50,
      "imc": 31,
      "glucosa": 128,
      "presion_sistolica": 142,
      "hipertension": True,
      "antecedentes_familiares_diabetes": True,
      "actividad_fisica": "sedentario",
      "alcohol": "no"
    }
    """

    # Validar que existan todos los hechos
    for f in FACTS:
        if f not in historial:
            historial[f] = 0  # por defecto si falta

    riskPorcentaje, explanations = infer_risk(historial)

    return {
        "porcentajeRiesgo": min(riskPorcentaje, 100)
        #"explicaciones": explanations
    }