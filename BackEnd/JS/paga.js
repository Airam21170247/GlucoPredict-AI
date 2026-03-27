import { auth, db } from "./configurationFirebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const where = params.get("where");

const btnPagar = document.getElementById("btnPagar");
const btnCancelar = document.getElementById("btnCancelar");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "../../index.html";
    }
});

// -----------------------------
// BOTÓN VOLVERSE DE PAGA
// -----------------------------
btnPagar.onclick = async () => {
    const user = auth.currentUser;

    if (!user) {
        alert("Sesión inválida");
        return;
    }

    try {
        await updateDoc(doc(db, "users", user.uid), {
            tipo: "PAGA"
        });

        alert("Ahora eres usuario de PAGA 🎉");
        redirigirWhere();

    } catch (error) {
        console.error(error);
        alert("Error al actualizar el plan");
    }
};



// -----------------------------
// CANCELAR
// -----------------------------
btnCancelar.onclick = () => {
    redirigirWhere();
};

// -----------------------------
// WHERE
// -----------------------------

function redirigirWhere() {
    // -----------------------------
    // WHERE
    // -----------------------------
    if (where === "registro") {
       window.location.href = "../../index.html";
    } else if (where === "servicio") {
        window.location.href = "../../FrontEnd/HTML/panel_principal.html";
    } else if (where === "boton") {
        window.location.href = "../../FrontEnd/HTML/panel_principal.html";
    } else if (where === "paciente") {
        window.location.href = "../../FrontEnd/HTML/panel_principal.html";
    } else if (where === "perfil") {
        window.location.href = "../../FrontEnd/HTML/perfil_persona.html";
    } else if (where === "clinicas") {
        window.location.href = "../../FrontEnd/HTML/medico_dashboard.html";
    } else if (where === "perfiles") {
        window.location.href = "../../FrontEnd/HTML/persona_dashboard.html";
    } else {
        window.location.href = "../../index.html";
    }
}