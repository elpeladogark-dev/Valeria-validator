import { valeria } from './valeria.js';

document.addEventListener("DOMContentLoaded", () => {
  const botonValidar = document.getElementById("validarBtn");
  const entradaJSON = document.getElementById("jsonInput");
  const ventana = document.getElementById("ventanaExplicacionValeria");

  botonValidar.addEventListener("click", () => {
    const jsonPegado = entradaJSON.value.trim();

    if (!jsonPegado) {
      ventana.innerHTML = "<span style='color:red'>❌ No se detectó ningún JSON. Pegá algo antes de validar.</span>";
      return;
    }

    if (valeria.entrada_json === "recibido" && valeria.correccion_permitida) {
      const resultado = validarJSON(jsonPegado);
      ventana.innerHTML = resultado.mensaje;
    } else {
      ventana.innerHTML = "<span style='color:red'>❌ Valeria no está disponible para validar en este momento.</span>";
    }
  });
});

function validarJSON(json) {
  try {
    JSON.parse(json);
    return {
      estado: "ok",
      mensaje: valeria.respuesta_usuario.mensaje_validacion_ok
    };
  } catch (e) {
    const linea = detectarLineaError(e);
    return {
      estado: "error",
      mensaje: valeria.respuesta_usuario.mensaje_error
        .replace("X", linea)
        .replace("descripción", e.message)
    };
  }
}

function detectarLineaError(error) {
  // Esta función puede mejorarse con un parser real
  // Por ahora devuelve "desconocida" como marcador simbólico
  return "desconocida";
}
