let jsonOriginal = "" // Guarda el bloque original
let jsonCorregido = "" // Guarda la versión corregida

function detectarDuplicados(obj, ruta = "", registro = [], contexto = {}) {
  const claves = new Set()
  for (const clave in obj) {
    const path = ruta ? `${ruta}.${clave}` : clave
    if (claves.has(clave)) {
      if (!esRepeticionFuncional(clave, path, obj)) {
        registro.push({ tipo: "error", mensaje: `🔁 Duplicado detectado en ${path}`, ruta: path })
      } else {
        registro.push({ tipo: "permitido", mensaje: `🧩 Repetición funcional permitida en ${path}`, ruta: path })
      }
    } else {
      claves.add(clave)
    }
    if (typeof obj[clave] === "object" && obj[clave] !== null) {
      detectarDuplicados(obj[clave], path, registro, contexto)
    }
  }
  return registro
}

function esRepeticionFuncional(clave, ruta, obj) {
  const secciones = ruta.split(".")
  return secciones.includes("activadores") || secciones.includes("modulo") || secciones.includes("validadores")
}

function validarJSON() {
  const input = document.getElementById("jsonInput").value
  const resultado = document.getElementById("resultado")
  jsonOriginal = input
  let canon = []

  try {
    const bloque = JSON.parse(input)
    const duplicados = detectarDuplicados(bloque)
    if (duplicados.some(d => d.tipo === "error")) {
      canon.push("🛡️ Corrección simbólica iniciada:")
      duplicados.forEach(d => canon.push(d.mensaje))
      document.getElementById("corregirBtn").style.display = "inline-block"
      document.getElementById("restaurarBtn").style.display = "none"
    } else {
      canon.push("✅ JSON validado. Blindaje simbólico intacto.")
      document.getElementById("corregirBtn").style.display = "none"
      document.getElementById("restaurarBtn").style.display = "none"
    }
  } catch (e) {
    canon.push(`❌ Error de sintaxis: ${e.message}`)
    document.getElementById("corregirBtn").style.display = "none"
    document.getElementById("restaurarBtn").style.display = "none"
  }

  resultado.textContent = canon.join("\n")
}

function corregirJSON() {
  try {
    let bloque = JSON.parse(jsonOriginal)
    let corregido = eliminarDuplicados(bloque)
    jsonCorregido = JSON.stringify(corregido, null, 2)
    document.getElementById("jsonInput").value = jsonCorregido
    document.getElementById("restaurarBtn").style.display = "inline-block"
    validarJSON()
  } catch (e) {
    document.getElementById("resultado").textContent = `❌ Error al corregir: ${e.message}`
  }
}

function eliminarDuplicados(obj) {
  if (Array.isArray(obj)) {
    return obj.map(eliminarDuplicados)
  } else if (typeof obj === "object" && obj !== null) {
    const nuevo = {}
    for (const clave in obj) {
      if (!nuevo.hasOwnProperty(clave)) {
        nuevo[clave] = eliminarDuplicados(obj[clave])
      }
    }
    return nuevo
  }
  return obj
}

function restaurarJSON() {
  document.getElementById("jsonInput").value = jsonOriginal
  document.getElementById("restaurarBtn").style.display = "none"
  validarJSON()
                          }
