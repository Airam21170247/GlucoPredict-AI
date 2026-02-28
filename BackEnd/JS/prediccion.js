export function calcularRiesgo(historial) {
    let riesgo = 0;

    if (historial.edad >= 45) riesgo += 15;
    if (historial.imc >= 30) riesgo += 20;
    if (historial.glucosa >= 126) riesgo += 30;
    if (historial.hipertension) riesgo += 15;
    if (historial.antecedentes_familiares_diabetes) riesgo += 20;

    return Math.min(riesgo, 100);
}