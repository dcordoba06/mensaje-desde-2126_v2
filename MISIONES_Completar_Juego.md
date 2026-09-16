# 🎮 MISIONES: Completa "Mensaje desde 2126"

## Estado del Proyecto
- **Progreso:** 70% completo (1 de 4 niveles terminados)
- **Tiempo estimado:** 3 sesiones de 90 minutos
- **Equipo:** Nicolás, Christopher, Alejandro
- **Meta Final:** Presentar en VII Torneo STEAM LUVÁ 2026

---

## 📍 ACTO 1: EL AGUA (Nivel 2)

### 🎯 MISIÓN 1.1: Diseña la Ciudad del Agua
**Objetivo:** Crear el mapa/tilemap para el Nivel 2

**Pasos:**
1. Abre MakeCode Arcade y tu proyecto
2. Haz clic en el ícono de **tilemap** (a la izquierda)
3. Crea un nuevo tilemap llamado **`ciudadAgua`**
4. Dibuja un mapa de ciudad con:
   - ✓ Calles para que el jugador camine
   - ✓ Edificios y áreas comerciales
   - ✓ Una zona de agua/plantas de tratamiento
   - ✓ Espacio vacío donde irá el dispositivo (coordenadas 25, 15)
5. Coloca marcadores de colores:
   - **Gris** = donde irán las piezas (3-5 lugares)
   - **Amarillo** = donde irán las monedas (2-3 lugares)
   - **Verde** = peligros/zonas contaminadas (2-3 lugares)

**✅ Checklist:**
- [ ] El mapa tiene un nombre correcto (`ciudadAgua`)
- [ ] Hay espacio para movimiento libre
- [ ] Los marcadores están bien distribuidos
- [ ] No hay zonas donde el jugador se quede atrapado

**🏆 Recompensa:** +100 XP de Programación

---

### 🎯 MISIÓN 1.2: Codifica la Carga del Nivel
**Objetivo:** Hacer que el Nivel 2 se cargue correctamente

**Pasos:**
1. Abre tu código (pestaña de **JavaScript/TypeScript**)
2. Encuentra la función `cargarNivel2()`
3. Reemplaza este código:
\`\`\`javascript
function cargarNivel2 () {
    tiles.setCurrentTilemap(tilemap\`ciudadAgua\`)
    ponerCartel("AGUA: TALLER", 29, 21)
}
\`\`\`

Con este:
\`\`\`javascript
function cargarNivel2 () {
    // 1. Cargar el mapa que diseñaste
    tiles.setCurrentTilemap(tilemap\`ciudadAgua\`)
    
    // 2. Poner los recursos (piezas, monedas, peligros)
    colocarRecursosYPeligros()
    
    // 3. Crear el dispositivo "Planta de Tratamiento"
    dispositivo = sprites.create(
        assets.image\`planta\`,
        SpriteKind.Equipo
    )
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(25, 15))
    
    // 4. Poner carteles para que el jugador sepa dónde está
    ponerCartel("PLANTA AGUA", 25, 10)
    ponerCartel("ENTRADA", 5, 5)
}
\`\`\`

**✅ Checklist:**
- [ ] El código se copió exactamente
- [ ] El nombre del tilemap es \`ciudadAgua\`
- [ ] La función \`colocarRecursosYPeligros()\` está incluida
- [ ] El código compila sin errores (no hay rojo en la consola)

**🏆 Recompensa:** +150 XP de Programación

---

### 🎯 MISIÓN 1.3: Crea la Secuencia Única del Nivel 2
**Objetivo:** Hacer que la reparación tenga una secuencia diferente

**Pasos:**
1. Encuentra la función \`comprobarBoton(boton: string)\`
2. Busca donde dice:
\`\`\`javascript
} else if (nivelActual == 2) {
\`\`\`

3. Si NO existe, agrega este bloque en \`comprobarBoton()\` antes del cierre:
\`\`\`javascript
} else if (nivelActual == 2) {
    // Nivel 2: A → ARRIBA → B → A (secuencia del AGUA)
    esValido = (pasoReparacion == 0 && boton == "A" ||
               pasoReparacion == 1 && boton == "ARRIBA" ||
               pasoReparacion == 2 && boton == "B" ||
               pasoReparacion == 3 && boton == "A")
}
\`\`\`

**Secuencia a memorizar:**
\`\`\`
PASO 1: Presiona A
PASO 2: Presiona ARRIBA (↑)
PASO 3: Presiona B
PASO 4: Presiona A
\`\`\`

**✅ Checklist:**
- [ ] El código está en la función \`comprobarBoton()\`
- [ ] La secuencia es: A → ARRIBA → B → A
- [ ] No hay errores de compilación
- [ ] Probaste presionando los botones en el simulador

**🏆 Recompensa:** +200 XP de Programación

---

### 🎯 MISIÓN 1.4: Escribe el Mensaje del Nivel 2
**Objetivo:** Que el jugador entienda qué debe hacer

**Pasos:**
1. Encuentra la función \`consultarMensaje()\`
2. Busca el bloque:
\`\`\`javascript
} else if (nivelActual == 2) {
\`\`\`

3. Si no existe, agrega este código:
\`\`\`javascript
} else if (nivelActual == 2) {
    game.showLongText("2126: El agua escasea. Sin agua fresca, no hay futuro. Necesitamos reparar la PLANTA DE TRATAMIENTO. Busca 3 piezas para reparar el sistema.", DialogLayout.Full)
}
\`\`\`

**✅ Checklist:**
- [ ] El mensaje es claro y entiende la misión
- [ ] Dice cuántas piezas se necesitan
- [ ] El código está en la función correcta
- [ ] Probaste presionando B para ver el mensaje

**🏆 Recompensa:** +100 XP de Storytelling

---

## ✅ RECOMPENSA DEL ACTO 1: ¡NIVEL 2 COMPLETADO!
**Puntos totales:** 550 XP

Ahora el jugador puede:
- Jugar el Nivel 2 completo
- Recoger recursos
- Reparar la planta de agua
- Pasar al Nivel 3

---

## 📍 ACTO 2: EL AIRE (Nivel 3)

### 🎯 MISIÓN 2.1: Diseña la Ciudad Contaminada
**Objetivo:** Crear el mapa para el Nivel 3

**Pasos:**
1. Crea un nuevo tilemap llamado **\`ciudadAire\`**
2. Dibuja un mapa con:
   - ✓ Zonas industriales (chimeneas, fábricas)
   - ✓ Humo visible (puedes usar tiles oscuros)
   - ✓ Un área central con el filtrador
   - ✓ Espacio para el dispositivo (coordenadas 20, 12)
3. Coloca marcadores:
   - **Gris** = 4 piezas
   - **Amarillo** = 2-3 monedas
   - **Verde** = 3 peligros (humo/contaminación)

**✅ Checklist:**
- [ ] El tilemap se llama \`ciudadAire\`
- [ ] Se ve industrial/contaminado
- [ ] Hay espacio para explorar
- [ ] Los recursos están bien distribuidos

**🏆 Recompensa:** +100 XP de Diseño

---

### 🎯 MISIÓN 2.2: Codifica cargarNivel3()
**Objetivo:** Que el Nivel 3 se cargue correctamente

**Pasos:**
1. Copia el patrón del Nivel 2
2. Edita \`cargarNivel3()\`:
\`\`\`javascript
function cargarNivel3 () {
    tiles.setCurrentTilemap(tilemap\`ciudadAire\`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(
        assets.image\`ventilador\`,
        SpriteKind.Equipo
    )
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(20, 12))
    ponerCartel("FILTRADOR AIRE", 20, 8)
    ponerCartel("ZONA INDUSTRIAL", 5, 5)
}
\`\`\`

**✅ Checklist:**
- [ ] El código se copió correctamente
- [ ] El tilemap es \`ciudadAire\`
- [ ] El dispositivo es \`ventilador\`
- [ ] Las coordenadas coinciden con tu mapa

**🏆 Recompensa:** +150 XP

---

### 🎯 MISIÓN 2.3: La Secuencia del Aire
**Objetivo:** Crear la secuencia B → A → ARRIBA → B

**Pasos:**
1. En \`comprobarBoton()\`, agrega:
\`\`\`javascript
} else if (nivelActual == 3) {
    // Nivel 3: B → A → ARRIBA → B
    esValido = (pasoReparacion == 0 && boton == "B" ||
               pasoReparacion == 1 && boton == "A" ||
               pasoReparacion == 2 && boton == "ARRIBA" ||
               pasoReparacion == 3 && boton == "B")
}
\`\`\`

**Secuencia:**
\`\`\`
B → A → ARRIBA → B
\`\`\`

**✅ Checklist:**
- [ ] La secuencia es exacta
- [ ] Probaste en el simulador
- [ ] No hay errores

**🏆 Recompensa:** +200 XP

---

### 🎯 MISIÓN 2.4: El Mensaje de Aire
**Objetivo:** Contar la historia del nivel

**Pasos:**
1. En \`consultarMensaje()\`, agrega:
\`\`\`javascript
} else if (nivelActual == 3) {
    game.showLongText("2126: El aire está tan contaminado que casi no podemos respirar. Las máquinas de filtración están rotas. Busca 4 piezas y repáralas rápido.", DialogLayout.Full)
}
\`\`\`

**✅ Checklist:**
- [ ] El mensaje es dramático (el aire está mal)
- [ ] Pide 4 piezas
- [ ] Está en la función correcta

**🏆 Recompensa:** +100 XP

---

## ✅ RECOMPENSA DEL ACTO 2: ¡NIVEL 3 COMPLETADO!
**Puntos totales:** 550 XP

---

## 📍 ACTO 3: LA NATURALEZA (Nivel 4)

### 🎯 MISIÓN 3.1: El Parque Destruido
**Objetivo:** Diseñar el mapa final

**Pasos:**
1. Crea **\`ciudadNaturaleza\`**
2. Dibuja:
   - ✓ Un parque en ruinas (sin árboles, sin vida)
   - ✓ Hormigón gris y zonas muertas
   - ✓ Una zona central de "riego" (donde irá el dispositivo)
   - ✓ Espacio para el sistema de riego (coordenadas 15, 10)
3. Marcadores:
   - **Gris** = 5 piezas (última es la más difícil)
   - **Amarillo** = 1-2 monedas (bonus)
   - **Verde** = 2-3 peligros

**✅ Checklist:**
- [ ] El mapa se ve desolado/triste
- [ ] Tiene espacio para explorar
- [ ] Los recursos son alcanzables

**🏆 Recompensa:** +100 XP

---

### 🎯 MISIÓN 3.2: Cargar el Nivel Final
**Objetivo:** Código para el Nivel 4

**Pasos:**
\`\`\`javascript
function cargarNivel4 () {
    tiles.setCurrentTilemap(tilemap\`ciudadNaturaleza\`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(
        assets.image\`arbol\`,
        SpriteKind.Equipo
    )
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(15, 10))
    ponerCartel("SISTEMA RIEGO", 15, 5)
    ponerCartel("PARQUE CENTRAL", 5, 5)
}
\`\`\`

**✅ Checklist:**
- [ ] El tilemap es \`ciudadNaturaleza\`
- [ ] El dispositivo es \`arbol\`
- [ ] Las coordenadas son 15, 10

**🏆 Recompensa:** +150 XP

---

### 🎯 MISIÓN 3.3: La Secuencia Final
**Objetivo:** ARRIBA → B → A → ARRIBA (la más difícil)

**Pasos:**
\`\`\`javascript
} else if (nivelActual == 4) {
    // Nivel 4: ARRIBA → B → A → ARRIBA (¡la más difícil!)
    esValido = (pasoReparacion == 0 && boton == "ARRIBA" ||
               pasoReparacion == 1 && boton == "B" ||
               pasoReparacion == 2 && boton == "A" ||
               pasoReparacion == 3 && boton == "ARRIBA")
}
\`\`\`

**Secuencia Final:**
\`\`\`
↑ → B → A → ↑
\`\`\`

**💡 Nota:** Esta es la secuencia más difícil porque empieza y termina con ARRIBA.

**✅ Checklist:**
- [ ] La secuencia es ARRIBA → B → A → ARRIBA
- [ ] Probaste varias veces
- [ ] ¡Es difícil! (como debe ser)

**🏆 Recompensa:** +200 XP (Misión Avanzada)

---

### 🎯 MISIÓN 3.4: La Revelación Final
**Objetivo:** Que el jugador descubra quién envió la máquina

**Pasos:**
1. Encuentra \`completarMision()\`
2. Busca donde dice \`if (nivelActual == 4)\`
3. Si no existe, añade DESPUÉS del bloque del Nivel 3:
\`\`\`javascript
    } else if (nivelActual == 4) {
        // ¡LA REVELACIÓN! Solo en el Nivel 4
        game.showLongText("Espera... ¿Qué pasa? Una voz llena de esperanza...", DialogLayout.Full)
        game.showLongText("Somos nosotros. Tus nietos. Del año 2126.", DialogLayout.Full)
        game.showLongText("Construimos esta máquina para enviarte un mensaje: el futuro no está escrito. Si actúas ahora, todo puede cambiar.", DialogLayout.Full)
        game.showLongText("Gracias por salvarnos.", DialogLayout.Full)
        game.splash("¡MISIÓN CUMPLIDA!", "¡EL FUTURO ESTÁ EN TUS MANOS!")
    }
\`\`\`

**✅ Checklist:**
- [ ] El código está en \`completarMision()\`
- [ ] Solo se muestra en el Nivel 4
- [ ] Los diálogos cuentan la historia correcta
- [ ] El \`game.splash()\` final es dramático

**🏆 Recompensa:** +250 XP (¡MISIÓN ÉPICA!)

---

## ✅ RECOMPENSA DEL ACTO 3: ¡JUEGO COMPLETADO!
**Puntos totales:** 700 XP

---

## 🏆 MISIÓN FINAL: Prueba Todo de Principio a Fin

**Objetivo:** Verificar que el juego completo funciona

**Pasos:**
1. ✓ Presiona **Play** en MakeCode
2. ✓ Selecciona un personaje (Nico, Cami, Ale o Cris)
3. ✓ Completa el Nivel 1 (reciclaje)
4. ✓ Completa el Nivel 2 (agua)
5. ✓ Completa el Nivel 3 (aire)
6. ✓ Completa el Nivel 4 (naturaleza)
7. ✓ Ve la revelación final
8. ✓ ¡GANASTE! 🎉

**✅ Checklist:**
- [ ] Los 4 niveles se cargan correctamente
- [ ] Puedes moverte en cada nivel
- [ ] Puedes recoger recursos
- [ ] Las secuencias de reparación funcionan
- [ ] La revelación se muestra al final

**🏆 Recompensa Final:** +500 XP + ¡PROYECTO TERMINADO!

---

## 📊 TABLA DE PUNTOS TOTALES

| Acto | Misión | Puntos |
|------|--------|--------|
| 1 | Diseña el agua | 100 |
| 1 | Código Nivel 2 | 150 |
| 1 | Secuencia agua | 200 |
| 1 | Mensaje agua | 100 |
| 1 | **SUBTOTAL** | **550** |
| 2 | Diseña aire | 100 |
| 2 | Código Nivel 3 | 150 |
| 2 | Secuencia aire | 200 |
| 2 | Mensaje aire | 100 |
| 2 | **SUBTOTAL** | **550** |
| 3 | Diseña naturaleza | 100 |
| 3 | Código Nivel 4 | 150 |
| 3 | Secuencia final | 200 |
| 3 | Revelación | 250 |
| 3 | **SUBTOTAL** | **700** |
| **FINAL** | Prueba total | 500 |
| | **TOTAL PUNTOS** | **2,300 XP** |

---

## 🎮 RESUMEN RÁPIDO

\`\`\`
MISIÓN 1 (Agua):     Mapa → Código → Secuencia → Mensaje
MISIÓN 2 (Aire):     Mapa → Código → Secuencia → Mensaje
MISIÓN 3 (Naturaleza): Mapa → Código → Secuencia → Revelación
MISIÓN 4 (Final):    ¡Prueba TODO!

Secuencias a recordar:
• Nivel 1: A → B → A → ARRIBA
• Nivel 2: A → ARRIBA → B → A
• Nivel 3: B → A → ARRIBA → B
• Nivel 4: ARRIBA → B → A → ARRIBA (¡LA MÁS DIFÍCIL!)
\`\`\`

---

## 💡 TIPS PARA TENER ÉXITO

1. **Haz una misión a la vez** - No intentes todas juntas
2. **Prueba cada misión** - Antes de pasar a la siguiente
3. **Si algo no funciona:**
   - Revisa la consola (abajo a la izquierda)
   - Verifica que los nombres sean exactos
   - Copia el código de nuevo (a veces hay espacios invisibles)
4. **Celebra cada logro** - ¡Acabas de programar un videojuego completo!

---

**¡A PROGRAMAR, EQUIPO ARCADECAN! 🚀**
