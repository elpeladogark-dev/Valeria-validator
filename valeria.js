let jsonOriginal = ""

function validarJSON() {
  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  jsonOriginal = input
  let canon = []

  // Desactiva corrección por defecto
  document.getElementById("corregirBtn").classList.add("desactivado")

  try {
    const bloque = JSON.parse(input)
    const duplicados = detectarDuplicados(bloque)

    if (duplicados.some(d => d.tipo === "error")) {
      canon.push("🛡️ Duplicados detectados:")
      duplicados.forEach(d => canon.push(d.mensaje))
    } else {
      canon.push("✅ JSON validado. Blindaje simbólico intacto.\nNo se detectaron duplicados ni errores de sintaxis.")
    }
  } catch (e) {
    canon.push(`❌ Error de sintaxis: ${e.message}\nPodés intentar repararlo con el botón de corrección.`)
    document.getElementById("corregirBtn").classList.remove("desactivado")
  }

  resultado.textContent = canon.join("\n")
}

function corregirJSON() {
  const boton = document.getElementById("corregirBtn")
  if (boton.classList.contains("desactivado")) return

  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  jsonOriginal = input
  let canon = []

  const reparado = sanarSintaxisJSON(input)
  document.getElementById("jsonInput").value = reparado
  canon.push("🔧 Sintaxis reparada. Podés validar nuevamente.")
  resultado.textContent = canon.join("\n")

  // Desactiva corrección después de aplicar
  boton.classList.add("desactivado")
}

function restaurarJSON() {
  if (!jsonOriginal) {
    document.getElementById("resultado").textContent = "⚠️ No hay JSON original guardado aún."
    return
  }

  document.getElementById("jsonInput").value = jsonOriginal
  document.getElementById("resultado").textContent = "♻️ JSON original restaurado."
}

function sanarSintaxisJSON(texto) {
  return texto
    .replace(/,\s*,/g, ",")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/}\s*{/g, "},\n{")
}

function detectarDuplicados(objeto, ruta = "") {
  let claves = new Set()
  let duplicados = []

  for (let clave in objeto) {
    const actual = typeof objeto[clave] === "object" ? objeto[clave] : null
    const rutaActual = ruta ? `${ruta}.${clave}` : clave

    if (claves.has(clave)) {
      duplicados.push({
        tipo: "error",
        mensaje: `🔁 Clave duplicada en "${rutaActual}"`
      })
    } else {
      claves.add(clave)
    }

    if (actual && !Array.isArray(actual)) {
      duplicados = duplicados.concat(detectarDuplicados(actual, rutaActual))
    }
  }

  return duplicados
}
