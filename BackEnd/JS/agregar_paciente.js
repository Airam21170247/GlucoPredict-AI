import { auth, db } from "./configurationFirebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Obtener clinica desde URL
const params = new URLSearchParams(window.location.search);
const clinicaId = params.get("clinica");

const btnVolver = document.getElementById("btnVolver");
const formPaciente = document.getElementById("formPaciente");

if (!clinicaId) {
    alert("Clinica no encontrada");
    window.location.href = "medico_dashboard.html";
}

btnVolver.onclick = () => {
    window.location.href = `clinica.html?id=${clinicaId}`;
};

formPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    const nombre = document.getElementById("nombrePaciente").value.trim();
    const edad = Number(document.getElementById("edadPaciente").value);
    const sexo = document.getElementById("sexoPaciente").value;
    const peso = document.getElementById("pesoPaciente").value;
    const altura = document.getElementById("alturaPaciente").value;
    const telefono = document.getElementById("telefonoPaciente").value.trim();
    const correo = document.getElementById("correoPaciente").value.trim();
    const contactoEmergencia = document.getElementById("contactoEmergenciaPaciente").value.trim();
    const tipoSangre = document.getElementById("tipoSangrePaciente").value.trim();
    const observaciones = document.getElementById("observacionesPaciente").value.trim();

    await addDoc(
        collection(db, "users", user.uid, "clinicas", clinicaId, "pacientes"),
        {
            nombre,
            edad,
            sexo,
            peso: peso ? Number(peso) : null,
            altura: altura ? Number(altura) : null,
            telefono,
            correo,
            contactoEmergencia,
            tipoSangre,
            observaciones,
            createdAt: new Date()
        }
    );

    window.location.href = `clinica.html?id=${clinicaId}`;
});
