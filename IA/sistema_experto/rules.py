# rules.py

RULES = [
    {
        "condition": lambda f: f["edad"] >= 45,
        "impact": 15,
        "explanations": "Mayor riesgo por edad ≥ 45 años"
    },
    {
        "condition": lambda f: f["imc"] >= 30,
        "impact": 20,
        "explanations": "Mayor riesgo por obesidad (IMC ≥ 30)"
    },
    {
        "condition": lambda f: 25 <= f["imc"] < 30,
        "impact": 10,
        "explanations": "Mayor riesgo por sobrepeso (25 ≤ IMC < 30)"
    },
    {
        "condition": lambda f: f["glucosa"] >= 126,
        "impact": 30,
        "explanations": "Mayor riesgo por glucosa en ayunas ≥ 126 mg/dL"
    },
    {
        "condition": lambda f: 100 <= f["glucosa"] < 126,
        "impact": 15,
        "explanations": "Mayor riesgo por glucosa en ayunas 100–125 mg/dL"
    },
    {
        "condition": lambda f: f["presion_sistolica"] >= 140,
        "impact": 10,
        "explanations": "Mayor riesgo por presión arterial elevada ≥ 140"
    },
    {
        "condition": lambda f: f["hipertension"],
        "impact": 10,
        "explanations": "Mayor riesgo por diagnóstico previo de hipertensión"
    },
    {
        "condition": lambda f: f["antecedentes_familiares_diabetes"],
        "impact": 20,
        "explanations": "Mayor riesgo por antecedentes familiares de Diabetes Tipo 2"
    }
]