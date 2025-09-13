let jsonOriginal = ""

function validarJSON() {
  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  jsonOriginal = input
  let canon = []

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
  const registro = document.getElementById("correcciones")
  jsonOriginal = input
  let canon = []

  const { reparado, cambios, zonasNoTocadas } = sanarSintaxisJSON(input)
  document.getElementById("jsonInput").value = reparado

  try {
    JSON.parse(reparado)
    canon.push("🔧 Sintaxis reparada. Podés validar nuevamente.")
    boton.classList.add("desactivado")
  } catch (e) {
    canon.push(`⚠️ Intenté reparar la sintaxis, pero el bloque sigue roto.\n${e.message}`)
  }

  resultado.textContent = canon.join("\n")

  let registroTexto = ""
  if (cambios.length) {
    registroTexto += "🧵 Cambios aplicados:\n" + cambios.map(c => "• " + c).join("\n") + "\n\n"
  } else {
    registroTexto += "🧵 No se aplicaron cambios sintácticos.\n\n"
  }

  if (zonasNoTocadas.length) {
    registroTexto += "🚫 Zonas detectadas pero no corregidas:\n" + zonasNoTocadas.map(z => "• " + z).join("\n")
  }

  registro.textContent = registroTexto
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
  let cambios = []
  let zonasNoTocadas = []
  let reparado = texto

  const reglas = [
    { regex: /,\s*,/g, descripcion: "Comas duplicadas eliminadas" },
    { regex: /,\s*}/g, descripcion: "Coma antes de cerrar llave eliminada" },
    { regex: /,\s*]/g, descripcion: "Coma antes de cerrar corchete eliminada" },
    { regex: /}\s*{/g, descripcion: "Objetos pegados separados con coma" }
  ]

  reglas.forEach(regla => {
    if (regla.regex.test(reparado)) {
      reparado = reparado.replace(regla.regex, match => {
        cambios.push(regla.descripcion + ` → "${match.trim()}"`)
        return match.replace(regla.regex, "")
      })
    }
  })

  const sinComillas = reparado.match(/:\s*([a-zA-Z0-9_]+)(\s*[,\]}])/g)
  if (sinComillas) {
    sinComillas.forEach(match => {
      zonasNoTocadas.push(`Valor sin comillas detectado → ${match.trim()}`)
    })
  }

  const comentarios = reparado.match(/\/\/.*|\/\*[\s\S]*?\*\//g)
  if (comentarios) {
    comentarios.forEach(c => {
      zonasNoTocadas.push(`Comentario inválido detectado → ${c.trim()}`)
    })
  }

  return { reparado, cambios, zonasNoTocadas }
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

    if (actual && !Array.isArray(actual))
