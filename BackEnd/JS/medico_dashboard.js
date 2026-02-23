import { auth, db } from "./configurationFirebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const lista = document.getElementById("listaClinicas");

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    lista.innerHTML = "";

    const ref = collection(db, "users", user.uid, "clinicas");
    const snapshot = await getDocs(ref);

    if (snapshot.empty) {
        lista.innerHTML = "<li>No tienes clínicas registradas</li>";
        return;
    }

    snapshot.forEach(doc => {
        const clinica = doc.data();

        const li = document.createElement("li");
        li.innerHTML = `
            ${clinica.nombre}
            <a href="clinica.html?id=${doc.id}">Ver</a>
        `;

        lista.appendChild(li);
    });
});