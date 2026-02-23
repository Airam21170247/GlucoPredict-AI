import { auth } from "./configurationFirebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
    if (!user) window.location.href = "../../index.html";
});

document.getElementById("btnClinicas").onclick = () =>
    window.location.href = "../../FrontEnd/HTML/medico_dashboard.html";

document.getElementById("btnPerfiles").onclick = () =>
    window.location.href = "../../FrontEnd/HTML/persona_dashboard.html";

document.getElementById("logoutBtn").onclick = () => auth.signOut();