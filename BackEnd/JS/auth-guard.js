import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./configurationFirebase.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // ❌ No hay sesión → redirigir
        console.warn("Usuario no autenticado, redirigiendo...");
        window.location.href = "../../index.html";
    } else {
        // ✅ Sesión válida
        console.log("Usuario autenticado:", user.email);
    }
});