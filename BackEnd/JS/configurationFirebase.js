import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  
export const firebaseConfig = {
  apiKey: "AIzaSyATJaR9NoVzk6EwpSxm9OG3bajhcY23Y4M",
  authDomain: "glucopredict-ai.firebaseapp.com",
  projectId: "glucopredict-ai",
  storageBucket: "glucopredict-ai.appspot.com",
  messagingSenderId: "5344131264",
  appId: "1:5344131264:web:a98c148676c4173cdad525",
  measurementId: "G-25NBPF8D8D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);