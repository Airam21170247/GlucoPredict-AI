import { auth, db } from "./configurationFirebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// -------------------------------------------------
// Obtener contexto desde URL
// -------------------------------------------------
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");          // "paciente" | "perfil"
const personaId = params.get("id");       // pacienteId o perfilId
const clinicaId = params.get("clinica");  // solo si es paciente

if (!tipo || !personaId) {
    alert("Contexto inválido");
    window.location.href = "panel_principal.html";
}

// -------------------------------------------------
// Construir referencia correcta
// -------------------------------------------------
function getHistorialRef(user) {
    if (tipo === "paciente") {
        return doc(
            db,
            "users", user.uid,
            "clinicas", clinicaId,
            "pacientes", personaId,
            "historial_clinico", "actual"
        );
    }

    if (tipo === "perfil") {
        return doc(
            db,
            "users", user.uid,
            "perfiles", personaId,
            "historial_clinico", "actual"
        );
    }
}

// -------------------------------------------------
// Cargar historial si existe
// -------------------------------------------------
onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const ref = getHistorialRef(user);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        actualizarInputs(snap.data());
    }
});

// -------------------------------------------------
// Guardar historial
// -------------------------------------------------
document.getElementById("historialForm")
.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    const data = {
        nombre: name.value || "No conocido",
        edad: Number(age.value) || 0,
        sexo: sex.value || "No conocido",
        imc: Number(bmi.value) || 0,
        glucosa: Number(glucose.value) || 0,
        presion_sistolica: Number(bp.value) || 0,
        antecedentes_familiares_diabetes: family.checked,
        hipertension: hypertension.checked,
        actividad_fisica: activity.value || "No conocido",
        alcohol: alcohol.value || "No conocido",
        updatedAt: new Date()
    };

    await setDoc(getHistorialRef(user), data);

    saveStatus.innerText =
        "Historial clínico guardado correctamente.";
});

// -------------------------------------------------
// Botón volver (dinámico)
// -------------------------------------------------
document.getElementById("btnVolver").onclick = () => {
    if (tipo === "paciente") {
        window.location.href =
            `paciente.html?id=${personaId}&clinica=${clinicaId}`;
    } else {
        window.location.href =
            `perfil_persona.html?id=${personaId}`;
    }
};

// Función para leer PDF en frontend
async function leerPDF(file) {
    const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
    let texto = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        texto += content.items.map(item => item.str).join(" ") + "\n";
    }
    return texto;
}

// Regex helpers en JS
function extraerDatos(texto) {
    const buscar = (patron, tipo="texto") => {
        const match = texto.match(patron);
        if (match) {
            let val = match[1].trim();
            if (tipo === "numero") return parseFloat(val) || 0;
            return val;
        }
        return tipo === "texto" ? "No conocido" : 0;
    };

    return {
        nombre: buscar(/Nombre[:\s]+([A-Za-zÁÉÍÓÚÑ\s]+)/i),
        edad: buscar(/Edad[:\s]+(\d+)/i, "numero"),
        sexo: buscar(/Sexo[:\s]+(Masculino|Femenino)/i),
        imc: buscar(/IMC[:\s]+([\d\.]+)/i, "numero"),
        glucosa: buscar(/Glucosa[:\s]+(\d+)/i, "numero"),
        presion_sistolica: buscar(/Presi[oó]n[:\s]+(\d+)/i, "numero"),
        antecedentes_familiares_diabetes: /antecedentes.*diabetes/i.test(texto),
        hipertension: /hipertensi[oó]n/i.test(texto),
        actividad_fisica: buscar(/Actividad f[ií]sica[:\s]+(\w+)/i),
        alcohol: buscar(/Alcohol[:\s]+(\w+)/i)
    };
}

// Procesar PDF en frontend
async function procesarPDF(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusElement = document.getElementById("pdfStatus");
    statusElement.innerText = "Leyendo PDF en navegador...";

    try {
        // 1. Leer PDF
        const texto = await leerPDF(file);

        // 2. Extraer datos con regex
        const datosRegex = extraerDatos(texto);

        // 3. Mostrar datos preliminares en inputs
        actualizarInputs(datosRegex);

        statusElement.innerText = "Datos preliminares extraídos. Refinando con IA...";

        // 4. Enviar datos al backend para refinamiento
        const response = await fetch("http://127.0.0.1:5000/api/refinar_historial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                preliminares: datosRegex
            })
        });

        const datosIA = await response.json();

        // 5. Actualizar inputs con datos refinados
        actualizarInputs(datosIA);

        statusElement.innerText = "Datos refinados por IA.";

    } catch (error) {
        console.error("Error procesando PDF:", error);
        statusElement.innerText = "Error al procesar el PDF.";
    }
}

// Función para actualizar inputs
function actualizarInputs(datos) {
    document.getElementById("name").value = datos.nombre || "No conocido";
    document.getElementById("age").value = datos.edad || 0;
    document.getElementById("sex").value = datos.sexo || "No conocido";
    document.getElementById("bmi").value = datos.imc || 0;
    document.getElementById("glucose").value = datos.glucosa || 0;
    document.getElementById("bp").value = datos.presion_sistolica || 0;
    document.getElementById("family").checked = datos.antecedentes_familiares_diabetes || false;
    document.getElementById("hypertension").checked = datos.hipertension || false;
    document.getElementById("activity").value = datos.actividad_fisica || "No conocido";
    document.getElementById("alcohol").value = datos.alcohol || "No conocido";
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("pdfFile");
    if (input) {
        input.addEventListener("change", procesarPDF);
    }

    const form = document.getElementById("historialForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            const saveStatus = document.getElementById("saveStatus");
            if (saveStatus) {
                saveStatus.innerText = "Historial clínico guardado correctamente.";
            }
        });
    }
});

