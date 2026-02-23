import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Obtener ID del perfil desde la URL
const params = new URLSearchParams(window.location.search);
const perfilId = params.get("id");

// Referencias HTML
const nombreEl = document.getElementById("nombrePerfil");
const edadEl = document.getElementById("edadPerfil");
const riesgoEl = document.getElementById("riesgoPrediccion");
const historialEl = document.getElementById("estadoHistorial");

if (!perfilId) {
    alert("Perfil no válido");
}

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
        const perfilRef = doc(db, "users", user.uid, "perfiles", perfilId);
        const perfilSnap = await getDoc(perfilRef);

        if (!perfilSnap.exists()) {
            alert("Perfil no encontrado");
            return;
        }

        const data = perfilSnap.data();

        // Mostrar datos (solo si existen)
        nombreEl.textContent = data.nombre ?? "—";
        edadEl.textContent = data.edad ?? "—";

        riesgoEl.textContent = data.prediccion
            ? `${data.prediccion}%`
            : "—";

        historialEl.textContent = data.historial
            ? "Historial registrado"
            : "No registrado";

    } catch (error) {
        console.error("Error cargando perfil:", error);
    }
});

btnHistorial.onclick = () => {
    window.location.href =
        `historial_clinico.html?tipo=perfil&id=${perfilId}`;
};