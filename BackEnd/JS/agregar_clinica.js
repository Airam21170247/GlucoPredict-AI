import { auth, db } from "./configurationFirebase.js";
import { addDoc, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("formClinica");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    const nombre = document.getElementById("nombreClinica").value;
    const direccion = document.getElementById("direccionClinica").value;

    await addDoc(collection(db, "users", user.uid, "clinicas"), {
        nombre,
        direccion,
        createdAt: new Date()
    });

    window.location.href = "medico_dashboard.html";
});