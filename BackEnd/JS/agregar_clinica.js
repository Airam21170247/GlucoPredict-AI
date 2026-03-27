import { auth, db } from "./configurationFirebase.js";
import { addDoc, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { MAX_CLINICAS } from "./reestrinccionesLicencia.js";


onAuthStateChanged(auth, async (user) => {
    const ref = collection(db, "users", user.uid, "clinicas");
    const snapshot = await getDocs(ref);

    const numeroClinicas = snapshot.size;

    console.log("Número de clínicas registradas:", numeroClinicas);
    console.log("Límite máximo de clínicas:", MAX_CLINICAS);

    if (numeroClinicas >= MAX_CLINICAS) {
        alert(`Has alcanzado el límite de ${MAX_CLINICAS} clínicas. No puedes agregar más.`);
        window.location.href = "medico_dashboard.html";
    }

});


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
