import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { calcularRiesgo } from "./prediccion.js";


/* -----------------------------
   PARÁMETROS URL
----------------------------- */
const params = new URLSearchParams(window.location.search);
const pacienteId = params.get("id");
const clinicaId = params.get("clinica");

if (!pacienteId || !clinicaId) {
    alert("Paciente o clínica no válidos");
    window.location.href = "panel_principal.html";
}

/* -----------------------------
   DOM
----------------------------- */
const nombreEl = document.getElementById("nombrePaciente");
const edadEl = document.getElementById("edadPaciente");
const estadoHistorialEl = document.getElementById("estadoHistorial");
const riesgoEl = document.getElementById("riesgoPrediccion");

const btnHistorial = document.getElementById("btnHistorial");
const btnVolver = document.getElementById("btnVolver");

/* -----------------------------
   AUTENTICACIÓN + CARGA
----------------------------- */
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../../index.html";
        return;
    }

    try {
        /* -----------------------------
           DATOS DEL PACIENTE
        ----------------------------- */
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

        nombreEl.innerText = paciente.nombre || "—";
        edadEl.innerText = paciente.edad || "—";

        /* -----------------------------
           HISTORIAL CLÍNICO
        ----------------------------- */
        const historialRef = doc(
            db,
            "users", user.uid,
            "clinicas", clinicaId,
            "pacientes", pacienteId,
            "historial_clinico", "actual"
        );

        const historialSnap = await getDoc(historialRef);

        if (!historialSnap.exists()) {
            estadoHistorialEl.innerText = "No registrado";
            riesgoEl.innerText = "—";
            return;
        }

        estadoHistorialEl.innerText = "Registrado";

        const historial = historialSnap.data();

        /* -----------------------------
           PREDICCIÓN
        ----------------------------- */
        const riesgo = calcularRiesgo(historial);
        riesgoEl.innerText = riesgo + "%";

    } catch (error) {
        console.error("Error cargando paciente:", error);
        alert("Error al cargar el perfil del paciente");
    }
});

/* -----------------------------
   NAVEGACIÓN
----------------------------- */
btnHistorial.onclick = () => {
    window.location.href =
        `historial_clinico.html?tipo=paciente&clinica=${clinicaId}&id=${pacienteId}`;
};

btnVolver.onclick = () => {
    window.location.href = `clinica.html?id=${clinicaId}`;
};