import { auth, db } from "./configurationFirebase.js";
import { collection,getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaPerfiles");

auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = "../../index.html";
        return;
    }

    const ref = collection(db, "users", user.uid, "perfiles");
    const snapshot = await getDocs(ref);

    lista.innerHTML = "";

    if (snapshot.empty) {
        lista.innerHTML = "<li>No hay perfiles registrados</li>";
        return;
    }

    snapshot.forEach((doc) => {
        const data = doc.data();

        const li = document.createElement("li");
        const edadTexto = data.edad ? `Edad: ${data.edad}` : "Edad: -";
        const sexoTexto = data.sexo ? ` | Sexo: ${data.sexo}` : "";

        li.innerHTML = `
            <strong>${data.nombre || "Perfil sin nombre"}</strong> (${edadTexto}${sexoTexto})
            <a href="perfil_persona.html?id=${doc.id}">Ver</a>
        `;

        // Guardamos el perfil seleccionado
        li.querySelector("a").addEventListener("click", () => {
            localStorage.setItem("perfilId", doc.id);
        });

        lista.appendChild(li);
    });
});
