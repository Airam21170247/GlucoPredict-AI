import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { calcularRiesgo } from "./prediccion.js";

/* -----------------------------
   PARÁMETROS URL
----------------------------- */
const params = new URLSearchParams(window.location.search);
const perfilId = params.get("id");

if (!perfilId) {
    alert("Perfil no válido");
    window.location.href = "panel_principal.html";
}

/* -----------------------------
   DOM
----------------------------- */
const nombreEl = document.getElementById("nombrePerfil");
const edadEl = document.getElementById("edadPerfil");
const historialEl = document.getElementById("estadoHistorial");
const riesgoEl = document.getElementById("riesgoPrediccion");

const btnHistorial = document.getElementById("btnHistorial");


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

        nombreEl.innerText = perfil.nombre || "—";
        edadEl.innerText = perfil.edad || "—";

        /* -----------------------------
           HISTORIAL CLÍNICO
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
            riesgoEl.innerText = "—";
            return;
        }

        historialEl.innerText = "Registrado";

        const historial = historialSnap.data();

        /* -----------------------------
           PREDICCIÓN
        ----------------------------- */
        const riesgo = calcularRiesgo(historial);
        riesgoEl.innerText = riesgo + "%";

    } catch (error) {
        console.error("Error cargando perfil:", error);
        alert("Error al cargar el perfil");
    }
});

/* -----------------------------
   NAVEGACIÓN
----------------------------- */
btnHistorial.onclick = () => {
    window.location.href =
        `historial_clinico.html?tipo=perfil&id=${perfilId}`;
};