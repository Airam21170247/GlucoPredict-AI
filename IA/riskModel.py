def predict_risk(data):
    """
    Retorna un porcentaje de riesgo estimado de diabetes tipo 2
    basado en reglas simples (prototipo).
    """

    risk = 0

    # Edad
    if data["age"] >= 45:
        risk += 15

    # IMC
    if data["bmi"] >= 30:
        risk += 25
    elif data["bmi"] >= 25:
        risk += 15

    # Glucosa
    if data["glucose"] >= 126:
        risk += 30
    elif data["glucose"] >= 100:
        risk += 15

    # Presión arterial
    if data["blood_pressure"] >= 140:
        risk += 10

    # Antecedentes familiares
    if data["family_history"]:
        risk += 20

    # Limitar a 100%
    return min(risk, 100)
