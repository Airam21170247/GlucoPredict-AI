import { auth, db } from "./configurationFirebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 Obtener clínica desde URL
const params = new URLSearchParams(window.location.search);
const clinicaId = params.get("clinica");

const btnVolver = document.getElementById("btnVolver");

if (!clinicaId) {
    alert("Clínica no encontrada");
    window.location.href = "medico_dashboard.html";
}

btnVolver.onclick = () => {
    window.location.href = `clinica.html?id=${clinicaId}`;
};

document.getElementById("formPaciente").addEventListener("submit", async e => {
    e.preventDefault();

    const user = auth.currentUser;

    await addDoc(
        collection(db, "users", user.uid, "clinicas", clinicaId, "pacientes"),
        {
            nombre: nombrePaciente.value,
            edad: edadPaciente.value,
            createdAt: new Date()
        }
    );

    // 🔹 Regresar a la clínica
    window.location.href = `clinica.html?id=${clinicaId}`;
});