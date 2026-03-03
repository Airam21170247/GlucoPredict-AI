import { auth, db } from "./configurationFirebase.js";
import { addDoc, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("formClinica");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    const nombre = document.getElementById("nombreClinica").value.trim();
    const direccion = document.getElementById("direccionClinica").value.trim();
    const telefono = document.getElementById("telefonoClinica").value.trim();
    const correo = document.getElementById("correoClinica").value.trim();
    const responsable = document.getElementById("responsableClinica").value.trim();
    const especialidad = document.getElementById("especialidadClinica").value.trim();
    const horario = document.getElementById("horarioClinica").value.trim();

    await addDoc(collection(db, "users", user.uid, "clinicas"), {
        nombre,
        direccion,
        telefono,
        correo,
        responsable,
        especialidad,
        horario,
        createdAt: new Date()
    });

    window.location.href = "medico_dashboard.html";
});
