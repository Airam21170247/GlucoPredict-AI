import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { calcularRiesgo } from "./prediccion.js";

/* -----------------------------
   PARAMETROS URL
----------------------------- */
const params = new URLSearchParams(window.location.search);
const perfilId = params.get("id");

if (!perfilId) {
    alert("Perfil no valido");
    window.location.href = "panel_principal.html";
}

/* -----------------------------
   DOM
----------------------------- */
const nombreEl = document.getElementById("nombrePerfil");
const edadEl = document.getElementById("edadPerfil");
const sexoEl = document.getElementById("sexoPerfil");
const pesoEl = document.getElementById("pesoPerfil");
const alturaEl = document.getElementById("alturaPerfil");
const telefonoEl = document.getElementById("telefonoPerfil");
const correoEl = document.getElementById("correoPerfil");
const antecedentesDiabetesEl = document.getElementById("antecedentesDiabetesPerfil");
const actividadFisicaEl = document.getElementById("actividadFisicaPerfil");
const observacionesEl = document.getElementById("observacionesPerfil");
const historialEl = document.getElementById("estadoHistorial");
const riesgoEl = document.getElementById("riesgoPrediccion");

const btnHistorial = document.getElementById("btnHistorial");

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
           PERFIL
        ----------------------------- */
        const perfilRef = doc(
            db,
            "users", user.uid,
            "perfiles", perfilId
        );

        const perfilSnap = await getDoc(perfilRef);

        if (!perfilSnap.exists()) {
            alert("Perfil no encontrado");
            return;
        }

        const perfil = perfilSnap.data();

        nombreEl.innerText = textoSeguro(perfil.nombre);
        edadEl.innerText = textoSeguro(perfil.edad);
        sexoEl.innerText = textoSeguro(perfil.sexo);
        pesoEl.innerText = textoSeguro(perfil.peso, " kg");
        alturaEl.innerText = textoSeguro(perfil.altura, " cm");
        telefonoEl.innerText = textoSeguro(perfil.telefono);
        correoEl.innerText = textoSeguro(perfil.correo);
        antecedentesDiabetesEl.innerText = textoSeguro(perfil.antecedentesDiabetes);
        actividadFisicaEl.innerText = textoSeguro(perfil.actividadFisica);
        observacionesEl.innerText = textoSeguro(perfil.observaciones);

        /* -----------------------------
           HISTORIAL CLINICO
        ----------------------------- */
        const historialRef = doc(
            db,
            "users", user.uid,
            "perfiles", perfilId,
            "historial_clinico", "actual"
        );

        const historialSnap = await getDoc(historialRef);

        if (!historialSnap.exists()) {
            historialEl.innerText = "No registrado";
            riesgoEl.innerText = "-";
            return;
        }

        historialEl.innerText = "Registrado";

        const historial = historialSnap.data();

        /* -----------------------------
           PREDICCION
        ----------------------------- */
        const riesgo = await calcularRiesgo(historial);
        riesgoEl.innerText = riesgo + "%";

    } catch (error) {
        console.error("Error cargando perfil:", error);
        alert("Error al cargar el perfil");
    }
});

/* -----------------------------
   NAVEGACION
----------------------------- */
btnHistorial.onclick = () => {
    window.location.href =
        `historial_clinico.html?tipo=perfil&id=${perfilId}`;
};
