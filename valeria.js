function detectarDuplicados(obj, ruta = "", registro = []) {
  const claves = new Set()
  for (const clave in obj) {
    const path = ruta ? `${ruta}.${clave}` : clave
    if (claves.has(clave)) {
      registro.push(`🔁 Duplicado detectado en ${path}`)
    } else {
      claves.add(clave)
    }
    if (typeof obj[clave] === "object" && obj[clave] !== null) {
      detectarDuplicados(obj[clave], path, registro)
    }
  }
  return registro
}

function validarJSON() {
  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  let canon = []

  try {
    const bloque = JSON.parse(input)
    const duplicados = detectarDuplicados(bloque)
    if (duplicados.length > 0) {
      canon.push("🛡️ Corrección simbólica iniciada:")
      canon.push(...duplicados)
    } else {
      canon.push("✅ JSON validado. Blindaje simbólico intacto.")
    }
  } catch (e) {
    canon.push(`❌ Error de sintaxis: ${e.message}`)
  }

  resultado.textContent = canon.join("\n")
}
