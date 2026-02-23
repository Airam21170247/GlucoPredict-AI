import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./configurationFirebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

registroForm.addEventListener("submit", async e => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
        email,
        createdAt: new Date()
    });

    window.location.href = "../../index.html";
});