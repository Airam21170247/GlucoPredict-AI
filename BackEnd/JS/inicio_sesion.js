import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./configurationFirebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  document.getElementById("googleLogin").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario:", result.user);
      // Redirigir al panel principal
      window.location.href = "FrontEnd/HTML/panel_principal.html";
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error: " + error.message);
    }
  });

  document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/FrontEnd/HTML/panel_principal.html";
    } catch (err) {
        alert("Credenciales incorrectas");
    }
});
