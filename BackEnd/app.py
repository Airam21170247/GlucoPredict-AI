from flask import Flask, request, jsonify
from flask_cors import CORS

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from IA.riskModel import predict_risk

app = Flask(__name__)
CORS(app)  # habilita CORS para todas las rutas

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    risk = predict_risk(data)
    return jsonify({
        "risk_percentage": risk
    })

if __name__ == "__main__":
    app.run(debug=True)
