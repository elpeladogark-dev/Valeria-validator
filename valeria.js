let jsonOriginal = ""

function validarJSON() {
  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  jsonOriginal = input
  let canon = []

  try {
    const bloque = JSON.parse(input)
    const duplicados = detectarDuplicados(bloque)

    if (duplicados.some(d => d.tipo === "error")) {
      canon.push("🛡️ Duplicados detectados:")
      duplicados.forEach(d => canon.push(d.mensaje))
      document.getElementById("corregirBtn").style.display = "none"
      document.getElementById("restaurarBtn").style.display = "none"
    } else {
      canon.push("✅ JSON validado. Blindaje simbólico intacto.\nNo se detectaron duplicados ni errores de sintaxis.")
      document.getElementById("corregirBtn").style.display = "none"
      document.getElementById("restaurarBtn").style.display = "none"
    }
  } catch (e) {
    canon.push(`❌ Error de sintaxis: ${e.message}\nPodés intentar repararlo con el botón de corrección.`)
    document.getElementById("corregirBtn").style.display = "inline-block"
    document.getElementById("restaurarBtn").style.display = "none"
  }

  resultado.textContent = canon.join("\n")
}

function corregirJSON() {
  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  jsonOriginal = input
  let canon = []

  const reparado = sanarSintaxisJSON(input)
  document.getElementById("jsonInput").value = reparado
  canon.push("🔧 Sintaxis reparada. Podés validar nuevamente.")
  document.getElementById("restaurarBtn").style.display = "inline-block"

  resultado.textContent = canon.join("\n")
}

function restaurarJSON() {
  document.getElementById("jsonInput").value = jsonOriginal
  document.getElementById("resultado").textContent = "♻️ JSON original restaurado."
  document.getElementById("restaurarBtn").style.display = "none"
  document.getElementById("corregirBtn").style.display = "none"
}

function sanarSintaxisJSON(texto) {
  return texto
    .replace(/,\s*,/g, ",")       // Comas duplicadas
    .replace(/,\s*}/g, "}")       // Coma antes de cerrar llave
    .replace(/,\s*]/g, "]")       // Coma antes de cerrar corchete
    .replace(/}\s*{/g, "},\n{")   // Objetos pegados sin coma
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
