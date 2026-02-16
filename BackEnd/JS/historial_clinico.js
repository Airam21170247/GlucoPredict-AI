// SIMULACIÓN de lectura de PDF
document.getElementById("pdfFile").addEventListener("change", procesarPDF);


function procesarPDF() {
    const fileInput = document.getElementById("pdfFile");

    if (!fileInput.files.length) {
        alert("Seleccione un archivo PDF");
        return;
    }

    document.getElementById("pdfStatus").innerText =
        "Procesando PDF y extrayendo información clínica...";

    // Simulación de extracción automática
    setTimeout(() => {
        document.getElementById("name").value = "Juan Pérez";
        document.getElementById("age").value = 50;
        document.getElementById("sex").value = "M";
        document.getElementById("activity").value = "sedentario";
        document.getElementById("alcohol").value = "ocasional";
        document.getElementById("bmi").value = 29.5;
        document.getElementById("glucose").value = 118;
        document.getElementById("bp").value = 135;
        document.getElementById("family").checked = true;

        document.getElementById("pdfStatus").innerText =
            "Datos extraídos del PDF. Revise y confirme la información.";
    }, 1500);
}

// Guardado del formulario
document.getElementById("historialForm").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("saveStatus").innerText =
        "Historial clínico guardado correctamente.";
});