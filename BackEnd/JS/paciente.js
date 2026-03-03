import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { calcularRiesgo } from "./prediccion.js";

/* -----------------------------
   PARAMETROS URL
----------------------------- */
const params = new URLSearchParams(window.location.search);
const pacienteId = params.get("id");
const clinicaId = params.get("clinica");

if (!pacienteId || !clinicaId) {
    alert("Paciente o clinica no validos");
    window.location.href = "panel_principal.html";
}

/* -----------------------------
   DOM
----------------------------- */
const nombreEl = document.getElementById("nombrePaciente");
const edadEl = document.getElementById("edadPaciente");
const sexoEl = document.getElementById("sexoPaciente");
const pesoEl = document.getElementById("pesoPaciente");
const alturaEl = document.getElementById("alturaPaciente");
const telefonoEl = document.getElementById("telefonoPaciente");
const correoEl = document.getElementById("correoPaciente");
const contactoEmergenciaEl = document.getElementById("contactoEmergenciaPaciente");
const tipoSangreEl = document.getElementById("tipoSangrePaciente");
const observacionesEl = document.getElementById("observacionesPaciente");
const estadoHistorialEl = document.getElementById("estadoHistorial");
const riesgoEl = document.getElementById("riesgoPrediccion");

const btnHistorial = document.getElementById("btnHistorial");
const btnVolver = document.getElementById("btnVolver");

function textoSeguro(valor, sufijo = "") {
    if (valor === null || valor === undefined || valor === "") {
        return "-";
    }
    return `${valor}${sufijo}`;
}

/* -----------------------------
   AUTENTICACION + CARGA
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

        nombreEl.innerText = textoSeguro(paciente.nombre);
        edadEl.innerText = textoSeguro(paciente.edad);
        sexoEl.innerText = textoSeguro(paciente.sexo);
        pesoEl.innerText = textoSeguro(paciente.peso, " kg");
        alturaEl.innerText = textoSeguro(paciente.altura, " cm");
        telefonoEl.innerText = textoSeguro(paciente.telefono);
        correoEl.innerText = textoSeguro(paciente.correo);
        contactoEmergenciaEl.innerText = textoSeguro(paciente.contactoEmergencia);
        tipoSangreEl.innerText = textoSeguro(paciente.tipoSangre);
        observacionesEl.innerText = textoSeguro(paciente.observaciones);

        /* -----------------------------
           HISTORIAL CLINICO
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
            riesgoEl.innerText = "-";
            return;
        }

        estadoHistorialEl.innerText = "Registrado";

        const historial = historialSnap.data();

        /* -----------------------------
           PREDICCION
        ----------------------------- */
        const riesgo = await calcularRiesgo(historial);
        riesgoEl.innerText = riesgo + "%";

    } catch (error) {
        console.error("Error cargando paciente:", error);
        alert("Error al cargar el perfil del paciente");
    }
});

/* -----------------------------
   NAVEGACION
----------------------------- */
btnHistorial.onclick = () => {
    window.location.href =
        `historial_clinico.html?tipo=paciente&clinica=${clinicaId}&id=${pacienteId}`;
};

btnVolver.onclick = () => {
    window.location.href = `clinica.html?id=${clinicaId}`;
};
