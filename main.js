import { valeria } from './valeria.js';

let jsonOriginal = "";

document.addEventListener("DOMContentLoaded", () => {
  const botonValidar = document.getElementById("validarBtn");
  const botonCorregir = document.getElementById("corregirBtn");
  const botonLimpiar = document.getElementById("limpiarVentanaBtn");
  const botonRestaurar = document.getElementById("restaurarBtn");

  const entradaJSON = document.getElementById("jsonInput");
  const ventana = document.getElementById("ventanaExplicacionValeria");

  botonValidar.addEventListener("click", () => {
    const jsonPegado = entradaJSON.value.trim();
    if (!jsonPegado) {
      ventana.innerHTML = "<span style='color:red'>❌ No se detectó ningún JSON. Pegá algo antes de validar.</span>";
      return;
    }

    jsonOriginal = jsonPegado;

    if (valeria.entrada_json === "recibido" && valeria.correccion_permitida) {
      const resultado = validarJSON(jsonPegado);
      ventana.innerHTML = resultado.mensaje;
      botonCorregir.disabled = resultado.estado !== "error";
    } else {
      ventana.innerHTML = "<span style='color:red'>❌ Valeria no está disponible para validar en este momento.</span>";
    }
  });

  botonCorregir.addEventListener("click", () => {
    const corregido = corregirJSON(entradaJSON.value);
    entradaJSON.value = corregido;
    botonCorregir.disabled = true;
  });

  botonLimpiar.addEventListener("click", () => {
    entradaJSON.value = "";
    ventana.innerHTML = "<span style='color:orange'>🧹 Ventana limpiada. Pegá un nuevo JSON para validar.</span>";
    botonCorregir.disabled = true;
  });

  botonRestaurar.addEventListener("click", () => {
    entradaJSON.value = jsonOriginal;
    ventana.innerHTML = "<span style='color:#00ffff'>♻️ JSON restaurado a su versión original antes de la validación.</span>";
    botonCorregir.disabled = false;
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

function corregirJSON(json) {
  let corregido = json;
  let mensaje = "";

  if (!corregido.trim().endsWith("}")) {
    corregido += "\n}";
    mensaje = valeria.respuesta_usuario.mensaje_correccion;
  } else {
    mensaje = valeria.respuesta_usuario.mensaje_correccion_fallida;
  }

  const ventana = document.getElementById("ventanaExplicacionValeria");
  ventana.innerHTML = mensaje;

  return corregido;
}

function detectarLineaError(error) {
  return "desconocida";
}
