namespace SpriteKind {
    export const Pieza = SpriteKind.create()
    export const Moneda = SpriteKind.create()
    export const Peligro = SpriteKind.create()
    export const Equipo = SpriteKind.create()
    export const Cartel = SpriteKind.create()
    export const Interfaz = SpriteKind.create()
}

// INICIO: cambia aquí los textos de la historia. El dibujo original está en "portada".
function presentarHistoria () {
    scene.setBackgroundImage(assets.image`portada`)
    game.splash("Mensaje desde 2126", "Ayuda hoy al futuro")
    game.showLongText("2026. Nico, Cami, Ale y Cris encuentran una maquina misteriosa. De pronto, recibe un mensaje fechado en 2126...", DialogLayout.Full)
    game.showLongText("Somos sus nietos y nietas. Nuestra ciudad necesita ayuda: hay residuos, falta agua y casi no quedan zonas verdes. Sus acciones de hoy pueden cambiar nuestro futuro.", DialogLayout.Full)
    game.showLongText("Elige tu personaje. Flechas: caminar. A: usar una maquina o un equipo cercano. B: consultar la mision. No hay combates.", DialogLayout.Full)
}

// HABILIDADES: los cuatro comienzan iguales; solo cambia una ventaja pequeña.
function prepararPersonaje () {
    capacidadPiezas = 3
    velocidad = 90
    descuentoPiezas = 0
    puntosReparacion = 100
    if (personajeSeleccionado == "Nico") {
        jugador = sprites.create(assets.image`nico`, SpriteKind.Player)
        capacidadPiezas = 4
    } else if (personajeSeleccionado == "Cami") {
        jugador = sprites.create(assets.image`cami`, SpriteKind.Player)
        descuentoPiezas = 1
    } else if (personajeSeleccionado == "Ale") {
        jugador = sprites.create(assets.image`ale`, SpriteKind.Player)
        velocidad = 110
    } else {
        jugador = sprites.create(assets.image`cris`, SpriteKind.Player)
        puntosReparacion = 125
    }
    scene.setBackgroundColor(15)
    scene.cameraFollowSprite(jugador)
    info.setScore(0)
    info.setLife(3)
    fondoContador = sprites.create(assets.image`barraEstado`, SpriteKind.Interfaz)
    fondoContador.setFlag(SpriteFlag.RelativeToCamera, true)
    fondoContador.setPosition(80, 112)
    fondoContador.z = 99
    contador = fancyText.create("")
    contador.setFlag(SpriteFlag.RelativeToCamera, true)
    contador.setPosition(80, 112)
    contador.z = 100
    fancyText.setColor(contador, 1)
}

// MAPAS: cada nivel tiene su propia función. Empieza editando ciudadReciclaje.
function cargarNivel () {
    estado = "mensaje"
    controller.moveSprite(jugador, 0, 0)
    limpiarEscenario()
    misionCompletada = false
    if (nivelActual == 1) {
        cargarNivel1()
    } else if (nivelActual == 2) {
        cargarNivel2()
    } else if (nivelActual == 3) {
        cargarNivel3()
    } else {
        cargarNivel4()
    }
    colocarBase()
    volverALaBase()
    consultarMensaje()
}

// NIVEL 1: este es el ejemplo jugable. Mueve los marcadores de colores en el mapa.
function cargarNivel1 () {
    tiles.setCurrentTilemap(tilemap`ciudadReciclaje`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(assets.image`recolector`, SpriteKind.Equipo)
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(29, 18))
    ponerCartel("ESCUELA", 29, 6)
    ponerCartel("RECICLAJE", 30, 19)
    ponerCartel("PARQUE", 8, 23)
}

// POR CONSTRUIR: diseña la misión del agua y coloca sus piezas y dispositivos.
function cargarNivel2 () {
    tiles.setCurrentTilemap(tilemap`ciudadAgua`)
    ponerCartel("AGUA: TALLER", 29, 21)
}

// POR CONSTRUIR: añade humo y dos componentes antes de la reparación final.
function cargarNivel3 () {
    tiles.setCurrentTilemap(tilemap`ciudadAire`)
    ponerCartel("AIRE: TALLER", 29, 21)
}

// POR CONSTRUIR: restaura el parque y escribe la revelación de la máquina.
function cargarNivel4 () {
    tiles.setCurrentTilemap(tilemap`ciudadNaturaleza`)
    ponerCartel("PARQUE: TALLER", 8, 23)
}

// LIMPIEZA: se usa al cambiar de nivel; regresar a la base NO repone los recursos.
function limpiarEscenario () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Pieza)
    sprites.destroyAllSpritesOfKind(SpriteKind.Moneda)
    sprites.destroyAllSpritesOfKind(SpriteKind.Peligro)
    sprites.destroyAllSpritesOfKind(SpriteKind.Equipo)
    sprites.destroyAllSpritesOfKind(SpriteKind.Cartel)
}

// BASE FÍSICA: está en la esquina superior izquierda. Usa A junto a cada equipo.
function colocarBase () {
    maquina = sprites.create(assets.image`maquina`, SpriteKind.Equipo)
    tiles.placeOnTile(maquina, tiles.getTileLocation(4, 4))
    botiquin = sprites.create(assets.image`botiquin`, SpriteKind.Equipo)
    tiles.placeOnTile(botiquin, tiles.getTileLocation(7, 4))
    mochila = sprites.create(assets.image`mochila`, SpriteKind.Equipo)
    tiles.placeOnTile(mochila, tiles.getTileLocation(10, 4))
    herramienta = sprites.create(assets.image`herramienta`, SpriteKind.Equipo)
    tiles.placeOnTile(herramienta, tiles.getTileLocation(10, 7))
    ponerCartel("BASE", 7, 2)
}

// CARTELES: usa esta función con un texto, una columna y una fila del mapa.
function ponerCartel (texto: string, columna: number, fila: number) {
    cartel = fancyText.create(texto)
    cartel.setKind(SpriteKind.Cartel)
    fancyText.setColor(cartel, 1)
    tiles.placeOnTile(cartel, tiles.getTileLocation(columna, fila))
}

// MARCADORES: gris = pieza, amarillo = moneda, verde = peligro. Se vuelven acera.
function colocarRecursosYPeligros () {
    for (let lugar of tiles.getTilesByType(assets.tile`marcaPieza`)) {
        objeto = sprites.create(assets.image`pieza`, SpriteKind.Pieza)
        tiles.placeOnTile(objeto, lugar)
        tiles.setTileAt(lugar, assets.tile`acera`)
    }
    for (let lugar of tiles.getTilesByType(assets.tile`marcaMoneda`)) {
        objeto = sprites.create(assets.image`moneda`, SpriteKind.Moneda)
        tiles.placeOnTile(objeto, lugar)
        tiles.setTileAt(lugar, assets.tile`acera`)
    }
    for (let lugar of tiles.getTilesByType(assets.tile`marcaPeligro`)) {
        objeto = sprites.create(assets.image`peligro`, SpriteKind.Peligro)
        tiles.placeOnTile(objeto, lugar)
        tiles.setTileAt(lugar, assets.tile`acera`)
    }
}

// VIDA: conserva piezas, dinero y puntaje al volver. No hay pérdida definitiva.
function volverALaBase () {
    tiles.placeOnTile(jugador, tiles.getTileLocation(6, 6))
    info.setLife(3)
    protegidoHasta = game.runtime() + 1500
    continuarExplorando()
}

function continuarExplorando () {
    estado = "exploracion"
    controller.moveSprite(jugador, velocidad, velocidad)
    actualizarContador()
}

// HUD: corazones y puntos usan Arcade. Aquí mostramos piezas y dinero.
function actualizarContador () {
    if (estado == "reparacion") {
        fancyText.setText(contador, "A B A ^  |  Paso " + (pasoReparacion + 1) + "/4")
    } else {
        fancyText.setText(contador, "Piezas " + piezas + "/" + capacidadPiezas + "  $" + dinero)
    }
    contador.setPosition(80, 112)
}

// MENSAJES: escribe aquí las misiones y pistas. B permite volver a leerlas.
function consultarMensaje () {
    estado = "mensaje"
    controller.moveSprite(jugador, 0, 0)
    if (nivelActual == 1) {
        calcularCosto()
        game.showLongText("2126: el centro de reciclaje no funciona. Reune " + costoReparacion + " piezas y repara el recolector al sureste de la ciudad. Evita los residuos verdes. La maquina, el botiquin y las mejoras estan en la base.", DialogLayout.Full)
    } else if (nivelActual == 2) {
        game.showLongText("NIVEL 2 - TALLER PARA CREAR. Proxima mision: recuperar el agua de la ciudad. Este mapa aun no tiene una mision jugable. Edita cargarNivel2 para continuar el proyecto.", DialogLayout.Full)
    } else if (nivelActual == 3) {
        game.showLongText("NIVEL 3 - TALLER PARA CREAR. Proxima mision: mejorar el aire. Agrega zonas de humo y componentes en cargarNivel3.", DialogLayout.Full)
    } else {
        game.showLongText("NIVEL 4 - TALLER PARA CREAR. Proxima mision: recuperar el parque. Agrega la restauracion y el secreto de la maquina en cargarNivel4.", DialogLayout.Full)
    }
    continuarExplorando()
}

// DISTANCIA: 22 píxeles permite usar un equipo estando a su lado.
function estaCerca (equipo: Sprite) {
    return Math.abs(jugador.x - equipo.x) < 22 && Math.abs(jugador.y - equipo.y) < 22
}

// TIENDA: la mochila cuesta 20 y llega hasta 5 piezas. Nico conserva su ventaja inicial.
function mejorarMochila () {
    estado = "mensaje"
    controller.moveSprite(jugador, 0, 0)
    if (capacidadPiezas >= 5) {
        game.showLongText("Tu mochila ya puede cargar 5 piezas.", DialogLayout.Bottom)
    } else if (dinero < 20) {
        game.showLongText("Mochila +1: cuesta 20 monedas. Encuentra monedas amarillas en la ciudad.", DialogLayout.Bottom)
    } else if (game.ask("Mochila +1: $20", "A: comprar / B: volver")) {
        dinero += -20
        capacidadPiezas += 1
    }
    continuarExplorando()
}

// HERRAMIENTA: una sola mejora de 30 monedas. Cami también conserva su descuento.
function mejorarHerramienta () {
    estado = "mensaje"
    controller.moveSprite(jugador, 0, 0)
    if (nivelHerramienta == 1) {
        game.showLongText("Ya tienes la herramienta mejorada.", DialogLayout.Bottom)
    } else if (dinero < 30) {
        game.showLongText("Herramienta: cuesta 30 monedas. Permite reparar usando una pieza menos.", DialogLayout.Bottom)
    } else if (game.ask("Herramienta: $30", "A: comprar / B: volver")) {
        dinero += -30
        nivelHerramienta = 1
    }
    continuarExplorando()
}

// COSTO: la reparación básica cuesta 3 piezas, con un mínimo de 1.
function calcularCosto () {
    costoReparacion = Math.max(1, 3 - descuentoPiezas - nivelHerramienta)
}

// REPARACIÓN: iniciar con A no cuenta como el primer paso de la secuencia.
function iniciarReparacion () {
    calcularCosto()
    estado = "mensaje"
    controller.moveSprite(jugador, 0, 0)
    if (piezas < costoReparacion) {
        game.showLongText("Necesitas " + costoReparacion + " piezas. Llevas " + piezas + ". Busca las piezas grises en las aceras.", DialogLayout.Bottom)
        continuarExplorando()
    } else {
        game.showLongText("Repara pulsando: A, B, A, ARRIBA. Si fallas, vuelve al primer paso. ABAJO cancela. Solo gastas piezas al completar la secuencia.", DialogLayout.Full)
        pasoReparacion = 0
        estado = "reparacion"
        actualizarContador()
    }
}

// SECUENCIA: cambia estas cuatro comparaciones para crear otra reparación.
function comprobarBoton (boton: string) {
    if (pasoReparacion == 0 && boton == "A" || pasoReparacion == 1 && boton == "B" || pasoReparacion == 2 && boton == "A" || pasoReparacion == 3 && boton == "ARRIBA") {
        pasoReparacion += 1
        if (pasoReparacion == 4) {
            completarMision()
        } else {
            actualizarContador()
        }
    } else {
        pasoReparacion = 0
        jugador.sayText("Otra vez: A B A ARRIBA", 1200, false)
        actualizarContador()
    }
}

// PREMIO Y PISTA: aquí pueden escribir cómo cambió 2126 y la primera pista.
function completarMision () {
    estado = "mensaje"
    misionCompletada = true
    piezas += 0 - costoReparacion
    dinero += 20
    info.changeScoreBy(puntosReparacion)
    dispositivo.setImage(assets.image`recolectorListo`)
    actualizarContador()
    game.showLongText("2126: funciona! El centro de reciclaje vuelve a recuperar materiales. Reutilizarlos ayuda a reducir residuos y la necesidad de fabricar materiales nuevos. Gracias!", DialogLayout.Full)
    game.showLongText("Primera pista: detras del recolector aparece el mismo simbolo que tiene la maquina. Quien lo puso ahi?", DialogLayout.Full)
    game.showLongText("Mision 1 completa: +20 monedas y +" + puntosReparacion + " puntos. Ahora visitaras el mapa de trabajo del nivel 2. Las siguientes misiones quedan para que ustedes las creen.", DialogLayout.Full)
    nivelActual += 1
    cargarNivel()
}

// RECOGER: una mochila llena deja la pieza en el suelo y no da puntos repetidos.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Pieza, function (sprite, otraPieza) {
    if (estado == "exploracion") {
        if (piezas < capacidadPiezas) {
            sprites.destroy(otraPieza)
            piezas += 1
            info.changeScoreBy(10)
            actualizarContador()
        } else {
            jugador.sayText("Mochila llena", 500, false)
        }
    }
})

sprites.onOverlap(SpriteKind.Player, SpriteKind.Moneda, function (sprite, moneda) {
    if (estado == "exploracion") {
        sprites.destroy(moneda)
        dinero += 10
        info.changeScoreBy(5)
        actualizarContador()
    }
})

// PELIGROS: como máximo un corazón cada 1,5 segundos. No hay enemigos.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Peligro, function (sprite, peligro) {
    if (estado == "exploracion" && game.runtime() >= protegidoHasta) {
        protegidoHasta = game.runtime() + 1500
        info.changeLifeBy(-1)
        jugador.sayText("Cuidado con los residuos!", 800, false)
    }
})

info.onLifeZero(function () {
    volverALaBase()
    jugador.sayText("A salvo! Conservas tus recursos.", 2000, false)
})

// BOTÓN A: cada equipo tiene una acción. Durante la reparación solo comprueba A.
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("A")
    } else if (estado == "exploracion") {
        if (estaCerca(maquina)) {
            consultarMensaje()
        } else if (estaCerca(botiquin)) {
            info.setLife(3)
            jugador.sayText("Tres corazones!", 1200, false)
        } else if (estaCerca(mochila)) {
            mejorarMochila()
        } else if (estaCerca(herramienta)) {
            mejorarHerramienta()
        } else if (nivelActual == 1 && estaCerca(dispositivo) && !(misionCompletada)) {
            iniciarReparacion()
        } else {
            jugador.sayText("Acercate a un equipo y pulsa A", 1200, false)
        }
    }
})

// BOTÓN B: fuera del minijuego vuelve a mostrar la misión.
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("B")
    } else if (estado == "exploracion") {
        consultarMensaje()
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("ARRIBA")
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        pasoReparacion = 0
        continuarExplorando()
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("IZQUIERDA")
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("DERECHA")
    }
})

let jugador: Sprite = null
let maquina: Sprite = null
let botiquin: Sprite = null
let mochila: Sprite = null
let herramienta: Sprite = null
let dispositivo: Sprite = null
let objeto: Sprite = null
let cartel: fancyText.TextSprite = null
let fondoContador: Sprite = null
let contador: fancyText.TextSprite = null
let menuPersonajes: Sprite = null
let personajeSeleccionado = ""
let estado = "seleccion"
let nivelActual = 1
let piezas = 0
let dinero = 0
let capacidadPiezas = 3
let velocidad = 90
let descuentoPiezas = 0
let puntosReparacion = 100
let nivelHerramienta = 0
let costoReparacion = 3
let pasoReparacion = 0
let protegidoHasta = 0
let misionCompletada = false
presentarHistoria()
menuPersonajes = miniMenu.createMenu(
miniMenu.createMenuItem("Ale: mas velocidad", assets.image`ale`),
miniMenu.createMenuItem("Cami: ahorra 1 pieza", assets.image`cami`),
miniMenu.createMenuItem("Cris: +25 al reparar", assets.image`cris`),
miniMenu.createMenuItem("Nico: carga 1 mas", assets.image`nico`)
)
miniMenu.onButtonPressed(menuPersonajes, miniMenu.Button.A, function (selection, selectedIndex) {
    miniMenu.close(menuPersonajes)
    if (selectedIndex == 0) {
        personajeSeleccionado = "Ale"
    } else if (selectedIndex == 1) {
        personajeSeleccionado = "Cami"
    } else if (selectedIndex == 2) {
        personajeSeleccionado = "Cris"
    } else {
        personajeSeleccionado = "Nico"
    }
    prepararPersonaje()
    cargarNivel()
})
