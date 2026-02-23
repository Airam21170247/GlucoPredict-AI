import { db } from "./configurationFirebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("formPerfil").addEventListener("submit", async e => {
    e.preventDefault();

    await addDoc(collection(db, "users", user.uid, "perfiles"), {
        nombre: nombrePerfil.value,
        edad: edadPerfil.value,
        createdAt: new Date()
    });

    window.location.href = "persona_dashboard.html";
});