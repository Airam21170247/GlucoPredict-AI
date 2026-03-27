import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./configurationFirebase.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore();

onAuthStateChanged(auth, async (user) => {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        window.user = userSnap.data();
        console.log("Usuario actual:", window.user);
        console.log("Tipo de usuario:", window.user.tipo);
        
        if (window.user.tipo !== "PAGA") {
            console.warn("Usuario no tiene licencia PAGA, redirigiendo...");
            auth.signOut();
            window.location.href = "../../index.html";
        }
    } else {
        console.log("No existe documento para este usuario en Firestore");
    }
});