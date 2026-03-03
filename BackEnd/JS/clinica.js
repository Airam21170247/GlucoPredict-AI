import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Obtener ID desde URL
const params = new URLSearchParams(window.location.search);
const clinicaId = params.get("id");

const nombreClinica = document.getElementById("nombreClinica");
const direccionClinica = document.getElementById("direccionClinica");
const telefonoClinica = document.getElementById("telefonoClinica");
const correoClinica = document.getElementById("correoClinica");
const responsableClinica = document.getElementById("responsableClinica");
const especialidadClinica = document.getElementById("especialidadClinica");
const horarioClinica = document.getElementById("horarioClinica");
const listaPacientes = document.getElementById("listaPacientes");
const btnAgregarPaciente = document.getElementById("btnAgregarPaciente");

if (!clinicaId) {
    alert("Clinica no encontrada");
    window.location.href = "medico_dashboard.html";
}

function textoSeguro(valor, prefijo = "") {
    if (!valor) {
        return `${prefijo}-`;
    }
    return `${prefijo}${valor}`;
}

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "../../index.html";
        return;
    }

    // Obtener datos de la clinica
    const clinicaRef = doc(db, "users", user.uid, "clinicas", clinicaId);
    const clinicaSnap = await getDoc(clinicaRef);

    if (!clinicaSnap.exists()) {
        alert("Clinica no encontrada");
        return;
    }

    const clinica = clinicaSnap.data();
    nombreClinica.textContent = `Clinica: ${clinica.nombre}`;
    direccionClinica.textContent = textoSeguro(clinica.direccion, "Direccion: ");
    telefonoClinica.textContent = textoSeguro(clinica.telefono, "Telefono: ");
    correoClinica.textContent = textoSeguro(clinica.correo, "Correo: ");
    responsableClinica.textContent = textoSeguro(clinica.responsable, "Responsable medico: ");
    especialidadClinica.textContent = textoSeguro(clinica.especialidad, "Especialidad: ");
    horarioClinica.textContent = textoSeguro(clinica.horario, "Horario: ");

    // Obtener pacientes
    const pacientesRef = collection(
        db, "users", user.uid, "clinicas", clinicaId, "pacientes"
    );

    const snapshot = await getDocs(pacientesRef);
    listaPacientes.innerHTML = "";

    if (snapshot.empty) {
        listaPacientes.innerHTML = "<li>No hay pacientes registrados</li>";
        return;
    }

    snapshot.forEach((docSnap) => {
        const paciente = docSnap.data();

        const li = document.createElement("li");
        const edadTexto = paciente.edad ? ` (Edad: ${paciente.edad})` : "";

        li.innerHTML = `
            ${paciente.nombre || "Paciente sin nombre"}${edadTexto}
            <a href="paciente.html?id=${docSnap.id}&clinica=${clinicaId}">
                Ver perfil
            </a>
        `;

        listaPacientes.appendChild(li);
    });
});

// Boton agregar paciente
btnAgregarPaciente.onclick = () => {
    window.location.href = `agregar_paciente.html?clinica=${clinicaId}`;
};
