import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Obtener ID desde URL
const params = new URLSearchParams(window.location.search);
const clinicaId = params.get("id");

const nombreClinica = document.getElementById("nombreClinica");
const direccionClinica = document.getElementById("direccionClinica");
const listaPacientes = document.getElementById("listaPacientes");
const btnAgregarPaciente = document.getElementById("btnAgregarPaciente");

if (!clinicaId) {
    alert("Clínica no encontrada");
    window.location.href = "medico_dashboard.html";
}

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    // 🔹 Obtener datos de la clínica
    const clinicaRef = doc(db, "users", user.uid, "clinicas", clinicaId);
    const clinicaSnap = await getDoc(clinicaRef);

    if (!clinicaSnap.exists()) {
        alert("Clínica no encontrada");
        return;
    }

    const clinica = clinicaSnap.data();
    nombreClinica.textContent = `Clínica: ${clinica.nombre}`;
    direccionClinica.textContent = `Dirección: ${clinica.direccion}`;

    // 🔹 Obtener pacientes
    const pacientesRef = collection(
        db, "users", user.uid, "clinicas", clinicaId, "pacientes"
    );

    const snapshot = await getDocs(pacientesRef);
    listaPacientes.innerHTML = "";

    if (snapshot.empty) {
        listaPacientes.innerHTML = "<li>No hay pacientes registrados</li>";
        return;
    }

    snapshot.forEach(docSnap => {
        const paciente = docSnap.data();

        const li = document.createElement("li");
        li.innerHTML = `
            ${paciente.nombre}
            <a href="paciente.html?id=${docSnap.id}&clinica=${clinicaId}">
                Ver perfil
            </a>
        `;

        listaPacientes.appendChild(li);
    });
});

// 🔹 Botón agregar paciente
btnAgregarPaciente.onclick = () => {
    window.location.href = `agregar_paciente.html?clinica=${clinicaId}`;
};