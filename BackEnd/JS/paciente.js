import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// -----------------------------
// Obtener parámetros URL (CORREGIDO)
// -----------------------------
const params = new URLSearchParams(window.location.search);
const pacienteId = params.get("id");        // <-- viene como id
const clinicaId = params.get("clinica");    // <-- viene como clinica

if (!pacienteId || !clinicaId) {
    alert("Paciente o clínica no válidos");
    window.location.href = "panel_principal.html";
}

// -----------------------------
// Referencias DOM
// -----------------------------
const nombreEl = document.getElementById("nombrePaciente");
const edadEl = document.getElementById("edadPaciente");
const estadoHistorialEl = document.getElementById("estadoHistorial");
const riesgoEl = document.getElementById("riesgoPrediccion");

const btnHistorial = document.getElementById("btnHistorial");
const btnVolver = document.getElementById("btnVolver");

// -----------------------------
// Autenticación + carga de datos
// -----------------------------
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        const pacienteRef = doc(
            db,
            "users", user.uid,
            "clinicas", clinicaId,
            "pacientes", pacienteId
        );

        const pacienteSnap = await getDoc(pacienteRef);

        if (!pacienteSnap.exists()) {
            alert("Paciente no encontrado");
            window.location.href = `clinica.html?id=${clinicaId}`;
            return;
        }

        const paciente = pacienteSnap.data();

        // -----------------------------
        // Información del paciente
        // -----------------------------
        nombreEl.innerText = paciente.nombre || "—";
        edadEl.innerText = paciente.edad || "—";

        // -----------------------------
        // Historial clínico
        // -----------------------------
        if (paciente.historial_clinico) {
            estadoHistorialEl.innerText = "Registrado";
        } else {
            estadoHistorialEl.innerText = "No registrado";
        }

        // -----------------------------
        // Predicción
        // -----------------------------
        if (paciente.prediccion?.riesgo !== undefined) {
            riesgoEl.innerText = paciente.prediccion.riesgo + "%";
        } else {
            riesgoEl.innerText = "—";
        }

    } catch (error) {
        console.error("Error cargando paciente:", error);
        alert("Error al cargar el perfil del paciente");
    }
});

// -----------------------------
// Navegación
// -----------------------------
btnHistorial.onclick = () => {
    window.location.href =
        `historial_clinico.html?tipo=paciente&clinica=${clinicaId}&id=${pacienteId}`;
};

btnVolver.onclick = () => {
    window.location.href = `clinica.html?id=${clinicaId}`;
};