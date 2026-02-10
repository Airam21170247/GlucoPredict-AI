import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { firebaseConfig } from "./configurationFirebase.js";


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  document.getElementById("googleLogin").addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario:", result.user);
      alert("Bienvenido con Google: " + result.user.email);
      // Redirigir a rol.html
      window.location.href = "rol.html";
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error: " + error.message);
    }
  });

  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Aquí puedes agregar la lógica para autenticar con correo y contraseña
    alert("Correo: " + email + "\nContraseña: " + password);
    // Redirigir a rol.html
    window.location.href = "rol.html";
  });

  document.getElementById("appleLogin").addEventListener("click", () => {
    alert("Funcionalidad de inicio con Apple no implementada aún.");
    // Redirigir a rol.html
    window.location.href = "rol.html";
  });
