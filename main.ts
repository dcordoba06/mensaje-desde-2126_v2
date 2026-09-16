namespace SpriteKind {
    export const Pieza = SpriteKind.create()
    export const Moneda = SpriteKind.create()
    export const Peligro = SpriteKind.create()
    export const Equipo = SpriteKind.create()
    export const Cartel = SpriteKind.create()
    export const Interfaz = SpriteKind.create()
}
/**
 * 1. INICIO Y PERSONAJES
 * 
 * Empieza aquí.
 * 
 * Abre prepararPersonaje para cambiar las habilidades.
 */
/**
 * 2. CIUDAD Y MISIÓN 1
 * 
 * Edita ciudadReciclaje en Recursos.
 * 
 * Los marcadores colocan piezas, monedas y peligros.
 */
/**
 * 3. RECURSOS Y VIDA
 * 
 * Recoger, proteger y volver a la base.
 * 
 * Los recursos recogidos no reaparecen al volver.
 */
/**
 * 4. BOTONES Y MEJORAS
 * 
 * A usa un equipo cercano. B consulta la misión.
 * 
 * Durante la reparación, los botones tienen otra función.
 */
/**
 * 5. REPARAR Y AVANZAR
 * 
 * Secuencia: A, B, A, arriba. Abajo cancela.
 * 
 * Las piezas se gastan solo al acertar.
 */
// POR CONSTRUIR: restaura el parque y escribe la revelación de la máquina.
function cargarNivel4 () {
    tiles.setCurrentTilemap(tilemap`level1`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(assets.image`arbol`, SpriteKind.Equipo)
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(15, 10))
    ponerCartel("SISTEMA RIEGO", 15, 5)
    ponerCartel("PARQUE CENTRAL", 5, 5)
}
function function_estilo_menu () {
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Margin, 3)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, -1)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, -5)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 4)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Border, 1)
}
function continuarExplorando () {
    estado = "exploracion"
    controller.moveSprite(jugador, velocidad, velocidad)
    actualizarContador()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("ARRIBA")
    }
})
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
// LIMPIEZA: se usa al cambiar de nivel; regresar a la base NO repone los recursos.
function limpiarEscenario () {
    sprites.destroyAllSpritesOfKind(SpriteKind.Pieza)
    sprites.destroyAllSpritesOfKind(SpriteKind.Moneda)
    sprites.destroyAllSpritesOfKind(SpriteKind.Peligro)
    sprites.destroyAllSpritesOfKind(SpriteKind.Equipo)
    sprites.destroyAllSpritesOfKind(SpriteKind.Cartel)
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
// BOTÓN B: fuera del minijuego vuelve a mostrar la misión.
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("B")
    } else if (estado == "exploracion") {
        consultarMensaje()
    }
})
// SECUENCIA: cambia estas cuatro comparaciones para crear otra reparación.
function comprobarBoton (boton: string) {
    if (nivelActual == 1) {
        // Nivel 1: A B A ARRIBA
        esValido = pasoReparacion == 0 && boton == "A" || pasoReparacion == 1 && boton == "B" || pasoReparacion == 2 && boton == "A" || pasoReparacion == 3 && boton == "ARRIBA"
    } else if (nivelActual == 2) {
        // Nivel 2: A ARRIBA B A
        esValido = pasoReparacion == 0 && boton == "A" || pasoReparacion == 1 && boton == "ARRIBA" || pasoReparacion == 2 && boton == "B" || pasoReparacion == 3 && boton == "A"
    } else if (nivelActual == 3) {
        // Nivel 3: B A ARRIBA B
        esValido = pasoReparacion == 0 && boton == "B" || pasoReparacion == 1 && boton == "A" || pasoReparacion == 2 && boton == "ARRIBA" || pasoReparacion == 3 && boton == "B"
    } else if (nivelActual == 4) {
        // Nivel 4: ARRIBA B A ARRIBA
        esValido = pasoReparacion == 0 && boton == "ARRIBA" || pasoReparacion == 1 && boton == "B" || pasoReparacion == 2 && boton == "A" || pasoReparacion == 3 && boton == "ARRIBA"
    }
    if (esValido) {
        pasoReparacion += 1
        if (pasoReparacion == 4) {
            completarMision()
        } else {
            actualizarContador()
        }
    } else {
        pasoReparacion = 0
        jugador.sayText("Intenta de nuevo", 1200, false)
        actualizarContador()
    }
}
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
        } else if (estaCerca(dispositivo) && !(misionCompletada)) {
            iniciarReparacion()
        } else {
            if (Created) {
                Created = true
                myTextSprite = fancyText.create("\"A\" para interactuar")
                myTextSprite.setPosition(72, 18)
                myTextSprite.setFlag(SpriteFlag.RelativeToCamera, true)
                myTextSprite.setFlag(SpriteFlag.Invisible, true)
                fancyText.setColor(myTextSprite, fancyText.twoToneColor(15, 15))
                fancyText.setFont(myTextSprite, fancyText.geometric_sans_6)
            } else {
                myTextSprite.setFlag(SpriteFlag.Invisible, false)
                fancyText.animateAtSpeed(myTextSprite, fancyText.TextSpeed.Fast, fancyText.AnimationPlayMode.UntilDone)
                pause(2000)
                myTextSprite.setFlag(SpriteFlag.Invisible, true)
            }
        }
    }
})
// VIDA: conserva piezas, dinero y puntaje al volver. No hay pérdida definitiva.
function volverALaBase () {
    tiles.placeOnTile(jugador, tiles.getTileLocation(6, 6))
    info.setLife(3)
    protegidoHasta = game.runtime() + 1500
    continuarExplorando()
}
// POR CONSTRUIR: diseña la misión del agua y coloca sus piezas y dispositivos.
function cargarNivel2 () {
    tiles.setCurrentTilemap(tilemap`level2`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(assets.image`planta`, SpriteKind.Equipo)
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(25, 15))
    ponerCartel("PLANTA AGUA", 25, 10)
    ponerCartel("ENTRADA", 5, 5)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("IZQUIERDA")
    }
})
// INICIO: cambia aquí los textos de la historia. El dibujo original está en "portada".
function presentarHistoria () {
    scene.setBackgroundImage(img`
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbf2fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbfffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbffffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999999fffffffff999999999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        99999999ff555555555ff9999999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999999f5555555555555f999999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        999999f555555555555555f99999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        99999f55555555555555555f9999999999999999999999999999999999999999999999999999fbbbbbbbf55fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        99999f55555555555555555f9999999999999f999f9999999999999999999999999999999999fbbbbbbbf5efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999f5555555555555555555f9999999999999f9ff999f999999999999999999999999999999fbbbbbbbf5efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        9999f5555555555555555555f99999999f999ff9f9f9f9999999999999999999999999999999fbbbbbbbffffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbffffffffffbbb
        9999f5555555555555555555f999999999f9f99f99f9f9999999ffffffffffffffffffffffffffffffffffffffffffffffffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbfff1111111111fbb
        9999f5555555555555555555f999999999f9ff999f9f9999999f4f5555555555555555555555f5555ee5555555eee555555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111111111fbb
        9999f5555555555555555555f9999999999f99f9f9999999999f4f5555555555555555555555f5555555555555555555555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbff111111111111111fb.
        9999f5555555555555555555f9999999999999f9f9999999999f4f555fffffffffffffffffffffffffffffffffffffff555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111111111111fb
        9999f5555555555555555555f99999999999999f99999999999f4f555f111111111111111111f111111111111111111f555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111111111111111f
        9999f5555555555555555555f99999999999999999999999999f4f555f111111111111111111f111111111111111111f555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbff11111111111111111111f
        9999f5555555555555555555f99999999999999999999999999f4f555fffffffffffffffffffffffffffffffffffffff555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111111111111111111
        99999f55555555555555555f999999999999999999999999999f4f5555555555555555555555f5555555555555555555555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf111111111111111111111111
        99999f555555555ffff5555f999999999999999999999999999f4f555fffffffffffffffffffffffffffffffffffffff555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111111111111111111111
        999999f555555ff1111ff5f9999999999999999999999999999f4f555f111111111111111111f111111111111111111f55efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111111111111111bbbb11
        9999999f5555f11111111f99999999999999999999999999999f4f555f111111111111111111f111111111111111111f5e4fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111111111111bbbbbbbbbb
        99999999ff55f11111111f999fff99999999999999999999999f4f555fffffffffffffffffffffffffffffffffffffff55efbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111111111111bbbbbfffffb
        9999999999ff1111111111f9f111f9999999999999999999999f4f5555555555555555555555f5555555555555555555555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111111111bbbbbbffbbbbbf
        9999999fff9f11111111111f11111f999999999999999999999f4f5555555555555555555555f5555555555555555555555fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111111111bbbbbbffbbbbbbbb
        999999f111f1d111111111d1111111f99999999999999999999f4f5555ffffffff555ffffffff555ffffffff55ffffffff5fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf111111111111bbbbbbffbbbbbbbbbb
        99999fd111111d1111111d1111111df99999999999999999999f4f5555f111111f555f111111f555f111111f55f111111f5fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111111bbbbbffbbbbbbbbbbbb
        99999fdd11111dd11111dd111111ddf99999999999999999999f4f5555f111111f555f111111f555f111111f55f111111f5fbbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111111bbbbfffbbbbbbbbbbbbbb
        99999fddddddddddddddddddddddddf99999999999999999999f4f5555f111111f555f111111f555f111111f55f111111f5fbbbbbbbbbbbbbbbbbbbbbbbbbbbf11111111bbbbbffbbbbbbbbbbbbbbbbb
        999999ffffffffffffffffffffffff999999999999999999999f4f5555f111111f555f111111f555f111111f55f111111f5fbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111bbbbffbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555f111111f555f111111f555f111111f55f111111f5fbbbbbbbbbbbbbbbbbbbbbbbbbbbf1111111bbbfbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555f111111f555f111111f555f111111f55f111111f5fbbbbbbbbbbbbbbbbbbbbbbbbbbffffffffffffbbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555ffffffff555ffffffff555ffffffff55ffffffff5fbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555555555555555555555f5555555555555555555eeefbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555555555555555555555f555555555555555555eeeefbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555555555555555555555feeeeee55555555555eee44fbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999999999999999999f4f5555555555555555555555fe4444ee5555555555ee444fbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        99999999999999999999999999999999999999ffff9999999999ffffffffffffffffffffffffffffffffffffffffffffffffbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        999999999999999999999999999999999999ff1111ff99999999999999999999999999999999fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccffffbbbbbbbbbbbbbbbbbb
        99999999999999999999999999999999999f11111111f9999999999999999999999999999999fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccf777fbbbbbbbbbbbbbbbbb
        99999999999999999999999999999999999f11111111f999fff9999999999999999999999999fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbfffbfffccccccccccf7777fbbbbbbbbbbbbbbbb
        9999999999999999999999999999999999f1111111111f9f111f999999999999999999999999fbbbbbbbbbbbbbbbbbbbbffffbbbbbbbbbbbbbbbbbbbf777ffffccccccccccf77777fbbbbbbbbbbbbbbb
        999999999999999999999999999999fff9f11111111111f11111f99999999999999999999999fbbbbbbbbbbbbbbbbbbff7777ffbbbbbbbbbbbbbbbbf67777fffccccccccccf77776fbbbbbbbbbbbbbbb
        99999999999999999999999999999f111f1d111111111d1111111f9999999999999999999999fbbbbbbbbbbbbbbbbbf77777777fbbbbbbbbbbbbbbbf66777fffccccccccccf77766fbbbbbbbbbbbbbbb
        9999999999999999999999999999fd111111d1111111d1111111df9999999999999999999999fbbbbbbbbbbbbbbbbbf77777777fbbbfffbbbbbbbbbf66666fffccccccccccf66666fbbbbbbbbbbbbbbb
        9999999999999999999999999999fdd11111dd11111dd111111ddf9999999999999999999999fbbbbbbbbbbbbbbbbf7777777777fbf777fbbbbbbbbbffffffffccccccccccffffffbbbbbbbbbbbbbbbb
        9999999999999999999999999999fddddddddddddddddddddddddf9999999999999999999999fbbbbbbbbbbbbfffbf77777777777f77777fbbbbbbbbbbb7bfffccccccccccfbbbb7bbbbbbbbbbbbbbbb
        99999999999999999999999999999ffffffffffffffffffffffff99999999999999999999999fbbbbbbbbbbbf777f7677777777767777777fbbbbbbb7bb7bfffccccccccccfb7bb7bbbbbbbbbbbbbbbb
        9999999999999999999999999999999999999999999999999999999999999999999999999999fbbbbbbbbbbf677777767777777677777776fbbbbbbb7bbbbfffccccccccccfb7bbbbbbbbbbbbbbbbbbb
        9999999999fff999999999999999999999999999999999999999999999999999999999999999fbbbbbbbbbbf667777766777776677777766fbbbbbbbbb7bbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        999999999fcf7f99999999999999999999999999999999999999999999999999999999999999fbbbbbbbbbbf666666666666666666666666fbbbbbb7bb7bbfffccccccccccf7bbbbbbbbbbbbbbbbbbbb
        999999999fcf7f99999999999999999999999999999999999999999999999999999999999999fbbbbbbbbbbbffffffffffffffffffffffffbbbbbbb7bbbbbfffccccccccccf7bb7bbbbbbbbbbbbbbbbb
        99999999fcf777f999999999999999999999999999999999999999999fff9999999999999999fbbbbbbbbbbbbbbbbbbbbbbbbbbbb7bbbbb7bbbbbb7bbbbb7fffccccccccccfbbb7bbbbbbbbbbbbbbbbb
        99999999fcf777f99999999999999999999999999999999999999999fcf7f999999999999999fbbbbbbbbbbbbbbbbbbbb7bbbbb7b7bb7bb7bbbbbb7bb7bb7fffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        9999999fcf77777f9999999999999999999999999999999999999999fcf7f999999999999999fbbbbbbbbbbbb7bbbbb7b7bb7bb7bbbb7bbbbbbbbbbbb7bbbfffccccccccccfbbbb7bbbbbbbbbbbbbbbb
        9999999fcf77777f999999999999999999999999999999999999999fcf777f99999999999999fbbbbbbbbbbbb7bb7bb7bbbb7bbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfb7bb7bbbbbbbbbbbbbbbb
        999999fcf7777777f99999999999999999999999999999999999999fcf777f99999999999999fbbbbbbbbbbbbbbb7bbbbbbbbbb7bbbbb7b7bbbbb7bbbbb7bfffccccccccccfb7bbbbbbbbbbbbbbbbbbb
        999999fcf7777777f9999999999999999999999999999999999999fcf77777f9999999999999fbbbbbbbbbbbbb7bbb7bbbbb7bb7bb7bb7b7bb7bb7bb7bb7bfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        99999fcf777777777f9999999999999999999fff99999999999999fcf77777f9999999999999fbbbbbbbbbb7bb7bbb7bb7bb7bbbbb7bbbbbbb7bbbbb7bbbbfffccccccccccfbbbbbbbbbbbbbbbbbbbbb
        99999fcf777777777f999999999999999999fcf7f999999999999fcf7777777f999999999999fbbbbbbbbbb7bbbbbbbbb7bbbbbbbbbbbbbbbbbbbbbbbbbbbfffccccccccccfffffffffffffffbbbbbbb
        9999fcf77777777777f9999fff9999999999fcf7f999999999999fcf7777777f999999999999fbbbbbbbbbffffffffffffffffffffffffffffffffffffffffffcccccccccccccccccccccccccfbbbbbb
        9999fcf77777777777f999fcf7f99999999fcf777f9999999999fcf777777777f99999999999fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        999fcf7777777777777f99fcf7f99999999fcf777f999999999ffcf777777777f99fff999999fbbbbbbbbfffcccccffffffffccccffffffffccccffffffffccccffffffffccccffffffffccccfbbbbbb
        999fcf7777777777777f9fcf777f999999fcf77777f9999999ffcf77777777777ffcf7f99999fbbbbbbbbfffccccf55555555fccf55555555fccf55555555fccf55555555fccf55555555fcccfbbbbbb
        99fcf777777777777777ffcf777f999999fcf77777f9999999ffcf77777777777ffcf7f99999fbbbbbbbbfffccccf55555555fccf55555555fccf55555555fccf55555555fccf55555555fcccfbbbbbb
        99fcf777777777777777fcf77777f9999fcf7777777f99999ffcf7777777777777ff777f9999fbbbbbbbbfffccccf55555555fccf55555555fccf55555555fccf55555555fccf55555555fcccfbbbbbb
        9fff77777777777777777ff77777f9999fcf7777777f99999ffcf7777777777777ff777f9999fbbbbbbbbfffccccf55555555fccf55555555fccf44455554fccf55555555fccf55555555fcccfbbbbbb
        ffcf77777777777777777f7777777f99fcf777777777f999ffcf777777777777777f7777f999fbbbbbbbbfffccccf55555555fccf55555555fccf44444444fccf55555555fccf55555555fcccfbbbbbb
        ffcfffffffffffffffffff7777777f99fcf777777777f999ffcf777777777777777f7777f999fbbbbbbbbfffccccf55555555fccf44444555fccf44444444fccf45555555fccf55555555fcccfbbbbbb
        7ffccccffeeeeeeef9fcf777777777ffcf77777777777f9ffff77777777777777777f7777f99fbbbbbbbbfffccccf55555555fccf44444455fccf44444444fccf44555544fccf44555555fcccfbbbbbb
        7ffffffcfeeeeeeef9fcf777777777ffcf77777777777f9ffcf77777777777777777f7777f99fbbbbbbbbfffccccf55554444fccf44444445fccf44444444fccf44445544fccf44445544fcccfbbbbbb
        77f999fcfeeeeeeeffcf77777777777ff7777777777777fcfcfffffffffffffffffff77777f9fbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        77f999fcfeeeeeeeffcf77777777777ff7777777777777fcffccccffeeeeeeeff777777777f9fbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        777f99fcfeeeeeeefcf7777777777777f77777777777777fffffffcfeeeeeeef77777777777ffbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        777f99fcfeeeeeeefcf7777777777777f77777777777777f77777fcfeeeeeeef77777777777ffbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        7777f9fcfeeeeeeeff777777777777777f77777777777777f7777fcfeeeeeeef777777777777fbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        7777f9fcfeeeeeeeff777777777777777f77777777777777f7777fcfeeeeeeef777777777777fbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        77777ffcfeeeeeeef77777777777777777fffffffffffffff7777fcfeeeeeeef777777777777fbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        77777ffcfeeeeeeef77777777777777777ffeeeeeeefcf7777777fcfeeeeeeef777777777777fbbbbbbbbfffccccf44444444fccf44444444fccf44444444fccf44444444fccf44444444fcccfbbbbbb
        777777fcfeeeeeeeffffffffffffffffffffeeeeeeeff77777777fcfeeeeeeef777777777777fbbbbbbbbfffcccccffffffffccccffffffffccccffffffffccccffffffffccccffffffffccccfbbbbbb
        777777fcfeeeeeeefcccffeeeeeeef999fcfeeeeeeeff77777777fcfeeeeeeef777777777777fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        fffffffcfeeeeeeeffffcfeeeeeeef999fcfeeeeeeefffffffffffcfeeeeeeeffffffffffffffbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeefccccffeeefcfeeeeeeefffeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeefffffcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ef9999fcfeeeeeeef99fcfeeeeeeef999fcfeeeeeeef999fcfeeefefeeeeeeefcfeeeeeeef99fbbbbbbbbfffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccfbbbbbb
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        7777777777777777777777777777577777777777777777777777777777777777777777777777f77777777777777777777777777777777777777777777777777777777777777777777777777777777777
        7777757777777777777777777775457777777777777777777777777777777777775777777777f77777777777b777777777777777777b7777777777777777777777777777777777777777777b77777777
        7777545777777777777777777777577777777775777777777777777777777777754577777777f7777777777beb7777777777777777beb77777777777777777777777777777777777777777beb7777777
        7777757777777777777777777777677777777754577777777777777777777777775777777777f77777777777b777777777777777777b777777777b777777777777777777777777777777777b77777777
        7777767777777777777777777777777777777775777777777777777777777777776777777777f77777777777c777777777777777777c77777777beb77777777777777777777777777777777c77777777
        77777777777777fffffffff77777777777777776777777777757777777777777777777777777f7777777777777777777777777777777777777777b777777fffffffffffff77777777777777777777777
        fffffffffffffff6666666fffff7777777777777777777777545777777777777777777777777f7777fffffffffffff77777777777777777777777c777ffff66666666666fffff7777777777777777777
        66666666666666699999996666fff77777777777777777777757777777777777ffffffffffffffffff66666666666fffff777777777777777777777fff666666676666666666ffffff777777777777ff
        99999999999999999999999999666ffff777777777777777776777777777fffff66666666666f66666666776666666666fffff777777777777777fff6666666666666666666666666ffffffffffffff6
        99999999999999999999999999999666ffff777777777777777777777ffff666699999999999f666676666666666666666666fffffffffffffffff666666666666666666776666666666666666666666
        99999999999999999999999999999999666ffffffff77777777777ffff666999999999999999f66666666666776666666666666666666666666666666666666777777666666666677766666666666666
        9999999999999999999999999999999999966666666ffffffffffff666999999999999999999f66666666666676666666666677666666666666677666666666666666666666666666666666666777666
        9999999999999999999999999999999999999999999666666666666999999999999999999999f66666676666666666766666666666676666666676666666666666666666666666666666666666666666
        9999999999999999999999999999999999999999999999999999999999999999999999999999f66766666666766666666677777666666666666666666666666666666666666677766666667776666666
        9999999999999999999999999999999999999999999999999999999999999999999999999999f66766666666666666666666666666666666666666666667666666666666666666666666666666666666
        9999999999999999999999999999999999999999999999999999999999999999999999999999f667766666666666666666666667766666677666776666666666666ffffffffff6666666666666777666
        fffffffffffffff9999999999999999999999999999999999999999999999999999999999999f66666666fffffff66666666666667666666666666666666666fffff77777777fffffff6666666666666
        77777777777777fffffff9999999999999999999999999999999999999999999999999999999f66fffffff77777ffffff666666666666666666666666666ffff777777777777777777ffff6666666666
        77777775777777777777fffff99999999999999999999999999999999999999999ffffffffffffff77777777b7777777fffff6666666666666666666fffff7777777777777777777777777ffffffffff
        777777545777777777777777ff9999999999999999999999999999999999999ffff777577777f7777777777beb7777777777ffffffffffffffffffff7777777777777777777777777777777777777777
        7777777577777777777777777fffffffff999999999999999999999999999fff777775457777f77777777777b777777777777777777777777777777777777777777777777b7777777777777777777777
        777777767777777777777777777777777fffffffffffffffffffffffffffff77777777577777f77777777777c77777777777777777777777777777777777777777777777beb777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777677777f777777777777777777777777777777777777777777777777777777777777b7777777777777777777777
        7777777777777777777777777777777777777777777777777777777777777777777777777777f777777777777777777777777777777777777777777777777777777777777c7777777777777777777777
        `)
    game.splash("Mensaje desde 2126", "Ayuda hoy al futuro")
    game.showLongText("2026. Nico, Cami, Ale y Cris encuentran una maquina misteriosa. De pronto, recibe un mensaje fechado en 2126...", DialogLayout.Full)
    game.showLongText("Somos sus nietos y nietas. Nuestra ciudad necesita ayuda: hay residuos, falta agua y casi no quedan zonas verdes. Sus acciones de hoy pueden cambiar nuestro futuro.", DialogLayout.Full)
    game.showLongText("Elige tu personaje. Flechas: caminar. A: usar una maquina o un equipo cercano. B: consultar la mision. No hay combates.", DialogLayout.Full)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Moneda, function (sprite, moneda) {
    if (estado == "exploracion") {
        sprites.destroy(moneda)
        dinero += 10
        info.changeScoreBy(5)
        actualizarContador()
    }
})
// HABILIDADES: los cuatro comienzan iguales; solo cambia una ventaja pequeña.
function prepararPersonaje () {
    capacidadPiezas = 3
    velocidad = 90
    descuentoPiezas = 0
    puntosReparacion = 100
    if (personajeSeleccionado == "Nico") {
        jugador = sprites.create(assets.image`nico0`, SpriteKind.Player)
        capacidadPiezas = 4
    } else if (personajeSeleccionado == "Cami") {
        jugador = sprites.create(assets.image`cami0`, SpriteKind.Player)
        descuentoPiezas = 1
    } else if (personajeSeleccionado == "Ale") {
        jugador = sprites.create(assets.image`ale0`, SpriteKind.Player)
        velocidad = 110
    } else {
        jugador = sprites.create(assets.image`cris`, SpriteKind.Player)
        puntosReparacion = 125
    }
    scene.setBackgroundColor(15)
    scene.cameraFollowSprite(jugador)
    info.setScore(0)
    info.setLife(3)
    fondoContador = sprites.create(assets.image`barraEstado0`, SpriteKind.Interfaz)
    fondoContador.setFlag(SpriteFlag.RelativeToCamera, true)
    fondoContador.setPosition(80, 112)
    fondoContador.z = 99
    contador = fancyText.create("")
    contador.setFlag(SpriteFlag.RelativeToCamera, true)
    contador.setPosition(80, 112)
    contador.z = 100
    fancyText.setColor(contador, 1)
}
// MENSAJES: escribe aquí las misiones y pistas. B permite volver a leerlas.
function consultarMensaje () {
    if (nivelActual == 1) {
        calcularCosto()
        game.showLongText("2126: La basura se acumula sin control. El reciclador está roto. Busca " + costoReparacion + " piezas y repáralo. ¡El planeta te necesita!", DialogLayout.Full)
    } else if (nivelActual == 2) {
        calcularCosto()
        game.showLongText("2126: El agua escasea sin remedio. La planta de tratamiento está destruida. Busca " + costoReparacion + " piezas y repárala. El agua es vida.", DialogLayout.Full)
    } else if (nivelActual == 3) {
        calcularCosto()
        game.showLongText("2126: El aire es tóxico. Las máquinas de filtración no funcionan hace años. Busca " + costoReparacion + " piezas y actívalas. Necesitamos aire limpio.", DialogLayout.Full)
    } else {
        calcularCosto()
        game.showLongText("2126: El parque está muerto. Sin zonas verdes, la ciudad es un desierto. Busca " + costoReparacion + " piezas y restaura el sistema de riego. ¡Devuelve la vida!", DialogLayout.Full)
    }
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
// CARTELES: usa esta función con un texto, una columna y una fila del mapa.
function ponerCartel (texto: string, columna: number, fila: number) {
    cartel = fancyText.create(texto)
    cartel.setKind(SpriteKind.Cartel)
    fancyText.setColor(cartel, 1)
    tiles.placeOnTile(cartel, tiles.getTileLocation(columna, fila))
}
// MARCADORES: gris = pieza, amarillo = moneda, verde = peligro. Se vuelven acera.
function colocarRecursosYPeligros () {
    for (let lugar of tiles.getTilesByType(assets.tile`transparency16`)) {
        objeto = sprites.create(assets.image`pieza0`, SpriteKind.Pieza)
        tiles.placeOnTile(objeto, lugar)
        tiles.setTileAt(lugar, assets.tile`transparency16`)
    }
    for (let lugar2 of tiles.getTilesByType(assets.tile`transparency16`)) {
        objeto = sprites.create(assets.image`moneda0`, SpriteKind.Moneda)
        tiles.placeOnTile(objeto, lugar2)
        tiles.setTileAt(lugar2, assets.tile`transparency16`)
    }
    for (let lugar3 of tiles.getTilesByType(assets.tile`transparency16`)) {
        objeto = sprites.create(assets.image`peligro0`, SpriteKind.Peligro)
        tiles.placeOnTile(objeto, lugar3)
        tiles.setTileAt(lugar3, assets.tile`transparency16`)
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("DERECHA")
    }
})
// HUD: corazones y puntos usan Arcade. Aquí mostramos piezas y dinero.
function actualizarContador () {
    if (estado == "reparacion") {
        fancyText.setText(contador, "A B A ^  |  Paso " + (pasoReparacion + 1) + "/4")
    } else {
        fancyText.setText(contador, "Piezas " + piezas + "/" + capacidadPiezas + "  $" + dinero)
    }
    contador.setPosition(80, 112)
}
// POR CONSTRUIR: añade humo y dos componentes antes de la reparación final.
function cargarNivel3 () {
    tiles.setCurrentTilemap(tilemap`level3`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(assets.image`ventilador`, SpriteKind.Equipo)
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(20, 12))
    ponerCartel("FILTRADOR AIRE", 20, 8)
    ponerCartel("ZONA INDUSTRIAL", 5, 5)
}
// BASE FÍSICA: está en la esquina superior izquierda. Usa A junto a cada equipo.
function colocarBase () {
    maquina = sprites.create(assets.image`maquina0`, SpriteKind.Equipo)
    tiles.placeOnTile(maquina, tiles.getTileLocation(4, 4))
    botiquin = sprites.create(assets.image`botiquin0`, SpriteKind.Equipo)
    tiles.placeOnTile(botiquin, tiles.getTileLocation(7, 4))
    mochila = sprites.create(assets.image`mochila0`, SpriteKind.Equipo)
    tiles.placeOnTile(mochila, tiles.getTileLocation(10, 4))
    herramienta = sprites.create(assets.image`herramienta0`, SpriteKind.Equipo)
    tiles.placeOnTile(herramienta, tiles.getTileLocation(10, 7))
    ponerCartel("BASE", 7, 2)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        pasoReparacion = 0
        continuarExplorando()
    }
})
// PREMIO Y PISTA: aquí pueden escribir cómo cambió 2126 y la primera pista.
function completarMision () {
    estado = "mensaje"
    misionCompletada = true
    piezas += 0 - costoReparacion
    dinero += 20
    info.changeScoreBy(puntosReparacion)
    if (nivelActual == 1) {
        dispositivo.setImage(assets.image`recolectorListo0`)
    } else if (nivelActual == 2) {
        dispositivo.setImage(assets.image`plantaLista`)
    } else if (nivelActual == 3) {
        dispositivo.setImage(assets.image`filtroListo`)
    } else if (nivelActual == 4) {
        dispositivo.setImage(assets.image`arbolVivo`)
    }
    actualizarContador()
    game.showLongText("2126: funciona! El centro de reciclaje vuelve a recuperar materiales. Reutilizarlos ayuda a reducir residuos y la necesidad de fabricar materiales nuevos. Gracias!", DialogLayout.Full)
    game.showLongText("Primera pista: detras del recolector aparece el mismo simbolo que tiene la maquina. Quien lo puso ahi?", DialogLayout.Full)
    game.showLongText("Mision 1 completa: +20 monedas y +" + puntosReparacion + " puntos. Ahora visitaras el mapa de trabajo del nivel 2. Las siguientes misiones quedan para que ustedes las creen.", DialogLayout.Full)
    nivelActual += 1
    cargarNivel()
}
info.onLifeZero(function () {
    volverALaBase()
    jugador.sayText("A salvo! Conservas tus recursos.", 2000, false)
})
// COSTO: la reparación básica cuesta 3 piezas, con un mínimo de 1.
function calcularCosto () {
    costoReparacion = Math.max(1, 3 - descuentoPiezas - nivelHerramienta)
}
// DISTANCIA: 22 píxeles permite usar un equipo estando a su lado.
function estaCerca (equipo: Sprite) {
    return Math.abs(jugador.x - equipo.x) < 22 && Math.abs(jugador.y - equipo.y) < 22
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
// PELIGROS: como máximo un corazón cada 1,5 segundos. No hay enemigos.
sprites.onOverlap(SpriteKind.Player, SpriteKind.Peligro, function (sprite, peligro) {
    if (estado == "exploracion" && game.runtime() >= protegidoHasta) {
        protegidoHasta = game.runtime() + 1500
        info.changeLifeBy(-1)
        jugador.sayText("Cuidado con los residuos!", 800, false)
    }
})
// NIVEL 1: este es el ejemplo jugable. Mueve los marcadores de colores en el mapa.
function cargarNivel1 () {
    tiles.setCurrentTilemap(tilemap`level1`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(assets.image`recolector0`, SpriteKind.Equipo)
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(29, 18))
    ponerCartel("ESCUELA", 29, 6)
    ponerCartel("RECICLAJE", 30, 19)
    ponerCartel("PARQUE", 8, 23)
}
let objeto: Sprite = null
let cartel: fancyText.TextSprite = null
let piezas = 0
let contador: fancyText.TextSprite = null
let fondoContador: Sprite = null
let descuentoPiezas = 0
let protegidoHasta = 0
let myTextSprite: fancyText.TextSprite = null
let Created = false
let misionCompletada = false
let herramienta: Sprite = null
let mochila: Sprite = null
let botiquin: Sprite = null
let maquina: Sprite = null
let pasoReparacion = 0
let esValido = false
let nivelHerramienta = 0
let dinero = 0
let jugador: Sprite = null
let dispositivo: Sprite = null
let personajeSeleccionado = ""
let menuPersonajes: Sprite = null
let TestMode = 0
let costoReparacion = 0
let puntosReparacion = 0
let velocidad = 0
let capacidadPiezas = 0
let nivelActual = 0
let estado = ""
scene.setBackgroundImage(img`
    555555555555555555555555555555fffffffffffff11111111ff5555555555f11111f5555555555555555555555555555555555555555fffffffff55555555555555555555555555555555555555555
    555555555555555555555555555555f9999999999fff11111111f5555555555ff1111ff5555555555555555555555555555555555555ff111111111ff555555555555555555555555555555555555555
    555555555555555555555555555555f9999999ff9f5f11111111ff5555555555ffff11fff5555555555555555555555555555555555f1111111111111f55555555555555555555555555555555555555
    555555555555555555555555555555f999999fff9f5fff11111111fffffffff5555ff111ff55555555555555555555555555555555f111111111111111f5555555555555555555555555555555555555
    5555555555555555555555555555555fffff9f.f9f555ffffff11111111111fff555f1111f55555555555555555555555555555555f111111111111111f5555555555555555555555555555555555555
    55555555555555555555555555555555555f9f.f9ff5555555ff111111111111ff55f1111ff555555555555555555555555555555f11111111111111111f555555555555555555555555555555555555
    55555555555555555555555555555555555f9fff99f55555555f1111111111111ffff11111f555555555555555555555555555555f11111f11111111111f555555555555555555555555555555555555
    555555555555555fffffff55555555ffffff999999f55555555ff111111111111111111111f5fffffff5555555555555555555555f11111f11f11111111f555555555555555555555555555555555555
    55555555555555f1111111f5555555f999999f9999f555555555f11111111111111111111fff1111111f555555555555555555555f11111111f11111111f555555555555555555555555555555555555
    5555555555555f111111111f555555f99999ff9999f555555555f111111111111111111111f111111111f55555555555555555555f11111111111111111f555555555555555555555555555555555555
    555555555555f111f1111111f55555f99999ff9999f55555555ff11111111111111111111f111f1111111f5555555555555555555f111f1111111111111f555555555555555555555555555555555555
    555555555555f111f1f11111f55555fffffffff99ff55555555f111111111111111111111f11ff111ff11f5555555555555555555f111f1111111111111f555555555555555555555555555555555555
    555555555555f11111f11111f5555555555555ff9f55555555ff111111111111111111111f11f11111111f5555555555555555555f111f1111111f11111f555555555555555555555555555555555555
    555555555555f11111111111f55555555555555fff555555ff1111111111111111111111ff11f111ff111f5555555555555555555f111ff11111ff11111f555555555555555555555555555555555555
    555555555555f11111111111f5555555555555555555555ff11111111111111111111111ff11f11111111f55555555555555555555f111f1111ff11111f5555555555555555555555555555555555555
    555555555555f11ff1111111f5555555ffffff55555555ff1111ffffffffffffffffff11ff11111111111f55555555555555555555f1111fffff111111f5555555555555555555555555555555555555
    555555555555f111ffff1111f555555ff99999fff55555f111fff5555555555555555f11ff11111111111f555555555555555555555f1111ff1111111f55555555555555555555555555555555555555
    5555555555555f111111111f555555ff9999fff9ff5555f111f555555555555555555f11f5f111111111f55555555555555555555555ff111111111ff555555555555555555555555555555555555555
    5555555555fffff1111111f5555555f999999f9f555555f111f555555555555555555f1ff55f1111111f555555555555555555555555fffffffffff55555555555555555555555555555555555555555
    55555555fff11f1fffffff55555555ff999999ffff5555f111f555555555555555555f1f5555fffffff55555555555555555555555fff1111111fffffffffffffff55555555555555555555555555555
    5555555ff111111111ffffff5555555fffff99999ff555f111ff55555555555555555f1f555555555555555555555555555555555ff11111111111111111111111ff5555555555555555555555555555
    5555555f111111111111111fffffffff....fff999f555ff111f5555555555555555ff1f55555555555555555555555555555555ff11111111111111111111111111ff55555555555555555555555555
    55ff55ff11111111111111111111111ffffffff999f5555ff111ff55555555fffffff11f5555555555555555555555555555555ff111111111111111111ffffff1111f55555555555555555555555555
    55f1fff1111111111111fffffff1111ff99999999ff55555f1111f5555555ff11111111f5555555555555555555555555555555f111111111111111111ff5555ff111ff5555555555555555555555555
    55f11111ffff11111111f55555ff111fff999fffff555555ff11ff5555555ff11111111f5555555555555555ffff55555555555f111111111111111111f555555ff111ff555555555555555555555555
    55f1111ff55f11111111f555555f111f5fffff55555555555fff.fffff5555ff1111111f55555555555555fff11ff555555555f1111111111111111111f5555555ff111f555555555555555555555555
    55ff111f555f11111111f555555f111f555555555555555555fffeeeeeffffffffffffff55555555555555f11111f55555555ff1111111111111111111f55555555f111f555555555555555555555555
    555f111f55ff11111111f555555f111f55ffffffff55555555feeeeefffeeefeeefffff555555555555555f11111ff5555ffff11111111111111111111f5555555ff111ff55555555555555555555555
    5555f1ff5ff111111111f555555f111f55f999999f555555ffeeeeffeeeeeefeeeeeeef555555555555555ff11111ffffff11111111111111111111111f5555555f11111f55555555555555555555555
    5555fff55f1111111111f555555f11ff55ffff99ff55555feeeeeeeeeeeeeefeeeeeeeef555555555555555ff11111111111111fffff11111111111111f5555555f11111f55555555555555555555555
    55555555ff1111111111f555555ffff5555ff99ff555555feeeeeeeeeeeeefeefeeeeeef5555555555555555ff111111111111ff555f11111111111111f555555ff11111f55555555555555555555555
    55555555f11111111111f5555555ff55555f99ffff5555feeeeeeeeeeeeeefeefeeeeeeef5555555555555555f11111111111ff5555f11111111111111f555555f111111f55555555555555555555555
    55555555f11111111111f55555555555555f99999f5555feeffeeeeeeeffefeefeeeeeeeef555555555555555ff111111111ff55555f11111111111111f555555f111111f55555555555555555555555
    55555555f11111111111f55555555555555fffffff555feefeefeeeeffeeefeefeeeefeeeef555555555555555ff1111111ff555555f11111111111111f555555ff11111f55555555555555555555555
    55555555f11111111111f555555555555555555555555feeeefeeeffeeeefeefeeeeeeffeeef555555555555555ff11111ff5555555f11111111111111f5555555f11111f55555555555555555555555
    55555555f11111111111f55555555555555555555555feeeefeeffeeeeeffeeeeefeeeeeeeef5555555555555555ff11ff555555555f11111111111111f55555555f1111f55555555555555555555555
    55555555f11111111111f55555555555555555555555feeeefeeeeeeefffffeeeefeeeeeeeeef5555555555555555ffff5555555555f11111111111111f555555555f1ff555555555555555555555555
    55555555f11111111111f5555555555555555555555feeeefeeeeeeefef..feeeeefeeeeeeeeef55555555555555555555555555555f11111111111111f555555555fff5555555555555555555555555
    55555555f11111111111f555555555555555555555ffeeefeeeeeeefef...feeeeeefeeeeeeeeef5555555555555555555555555555f11111111111111f5555555555555555555555555555555555555
    5555555f111111111111f555555fff55555555555feeeeefeeeeeefeef...feeeeeefeeeeeeeeeef55f555555555555555555555555f11111111111111f5555555555555555555555555555555555555
    55555fff1111ffff1111ff555fff1ffff555555ffeeeeefeeeeeffeeef...feeeeeeefeeeeeeeeef5ff555555555555555555555555f11111111111111f55555fffffffff55555555555555555555555
    ffffff1111fff22fff111ffffff111f.fffffffeeeeeefeeeeefeeeeef....feeeeeeefeeeeeeeffffffffffffffffffffffffffffff11111111111111fffffff2222222ffffff555555555555555fff
    2222f1111ff222222f111fffff1111ff22222feeeeeeefeeeefeeeeeef.....feeeeeefeeefeeefef22222222222222222222222222f11111111111111f2222222222222222222ffffffffffffffff22
    222ff1111f22222222f1111111111ff222222feeeeeeeeefeeeeeeeef.......feeeeeefeefeefeef2222222222222222222222222ff11111111111111f2222222222222222222222222222222222222
    222f11111f22222222ff1111111fff22222222feeeeeeeefeeeeefff.........ffeeeeefeeeeeef22222222222222222222222222f111111fff111111f2222222222222222222222222222222222222
    22ff11111f222222222ff11111ff22222222222feeefeeefeeefffffff..fffff..ffeeefeeeeeeff222222222222222222222222ff1111fff2fff1111ff2222ffffff22222222222222222222222222
    22ff11111f2222222222fffffff2222222222222fefeeeefeeef.11ff....ff11....fefffeeeeeeefff2222222222222222222ff11111ff22222f11111f222ff1111f22222222222222222222222222
    222f1111ff222222222222222222222222222222fefeeeefeeef.11ff....ff11...f.f.feeeeffffff2222222222222222222ff11111f2222222ff1111f22ff111111f2222222222222222222222222
    222f1111f22222222222222222222222222222222feeeeefeeef.11ff....ff11...f.f.feeeeef2222222222222222222222ff11111ff22222222f1111ffff1111111f2222222222222222222222222
    222ff1fff2222222222222222222222222222222feeeeeefeeef.............f.f..f..feeeeef2222222222222222222ff1111111f222222222ff11111111111111f2222222222222222222222222
    2222fff222fffffff22222222ffff22222222222feeeefefeeef...............f..f..fffeeeef22222222222222222ff1111111ff2222222222f1111111111111ff2222222222222222222222222
    22222ffffff99999fff222f2ff99ff22fff2fff2ffeefeeeeeef................fff.fef.ffeef22222222222222222f1111111ff22222222222ff11111111111ff22222222222222222222222222
    22222f999999999999f22ff2f9999f22f9fff9f222fefeeeeeeef.....e..e..........feef22ff.f2222222222222222f111111ff2222222222222f111111111fff222222222222222222222222222
    22222f9fffff99999ff22f9ff9999f22f99ff9f2222feeeeffeeef.....ee.........ffeeef2222fff222222222222222f11111ff222222222222222ffffffffff22222222222222222222222222222
    22222f9ff22f9999ff222ff9f9ff9f22f999f9f222feeefffeeeeef...........ffffeeeeeef2222222222222222222222ff11ff2222222222222222222222222222222222222222222222222222222
    22222f99ffff9ffff222f9ff99ff9ff2f9f999f222feff22feeeeeeffff.....ff.feeeeeeeef22222222222222222222222ffff22222222222222222222222222222222222222222222222222222222
    22222f99999999fff222f9f999ff99f2f9ff99f222ff222feeeeeeef222fff.f..ffeefffeeeef2222222222222222222222222222222222222222222222222222222222222222222222222222222222
    22222f999ffff999f222f9999f2f99f2f9fffff2222222feefeeeeef22222ff..f..fef22ffeef2222222222222222222222222222222222222222222222222222222222222222222222222222222222
    22222f999f22f999f222f9999f2f99f2fff22222222222feeffeeef222f2f....f...ff2222ff2f2222222222222222222222222222fffffffff22222222222222222222222222ff2222222222222222
    22222f999f22f999f222f9999f2f9ff2222222222222222feffeef22fff2f....f.fff222222222222222222222222222222ffffffff9999999fff222ffff2222fffff22222222ffff22222222222222
    22222f999f22f999f222ff999f2fff222222222222222222fffff22f666f.....ff666ffff2222222222222222222222222222f999999999999999ff22f9ff22ff9999ff222222f99f2222fff2222222
    22222f999f22f999f2222ff9ff222222222222222222222222f222f66666fffffff6666666fff2222222222222222222222222f999999999999999ff22f99f22f999999ff22222f99f2222f9ff222222
    22222ffff222fffff222fffffff22222222222222222222222222f6666666666666666666666f222222222222222222222222ff99ffff99999999ff22f999f22f9999999f22222f99f2222f99f222222
    2222222222222222222f1111111f222222222222222222222222ff666666666666666666f666f222222222222222222222222f999f222ff9999ff2222f99ff22f9ffff99ff2222f99f2222f99f222222
    222222222222222222f111111111f22222222222222222222222f6666666666666666666f666f222222222222222222222222f999f222ff9ffff2222f999f222f99f2f999f2222f99f2222f99ff22222
    22222222222222222f111f1111111f222222222222222222222ff6666666666666666666f666f222222222222222222222222f999fffff999ff22222f999f222f99f2f999f2222f99ff222f999f22222
    22222222222222222f111f1f11111f22222222222222222222f666666666666666666666f666f222222222222222222222222f999999999999ff2222f999f2fff99f2f999f2222f999fffff999f22222
    22222222222222222f11111f11111f22222222222222222222f66f666666661111166666f666f222222222222222222222222f9999999999999ff222f999fff9999f2f999f222ff99999999999f22222
    22222222222222222f11111111111f2222222222222222222f666f666666611111166666f66ffff222222222222222222222ff9999fff9999999ff22f999999999ff2f999f222f99fff999999ff22222
    22222222222222222f11111111111f2222222222222222222fff6f666666616166666666fff...f222222222222222222222f9999ff2f99999999f22f999999999f22f999f222f99f2ff99999f222222
    22222222222222222f11ff1111111f222222222222222222f..fff666666616166666666f.....f222222222222222222222f9999f22ff999999ff22f999999999f2ff99ff222f99f22f99999f222222
    22222222222222222f111ffff1111f222222222222222222f....f666666661111166666ff....f222222222222222222222f9999f222f999999f222f99999999ff2f999f2222f99f22ff9999f222222
    222222222222222222f111111111f2222222222222222222f....f6666666611111666666f.....f22222222222222222222f9999f222f99999ff222f99999999f22f999f2222f99f222ff99ff222222
    222222222222222fffff1111111f22222222222222222222f....f6666666666666666666f.....f22222222222222222222f9999f222f99999f2222ff999999ff22f999f2222ffff2222ff9f2222222
    2222222222222fff11f1fffffff2222222222222222222222f...f66666666666666666666f....f22222222222222222222f999ff222ff99fff22222fff9999f222fffff2222222222222fff2222222
    222222222222ff111111111ffffff22222222222222222222f...f66666666666666666666f....fffff2222222222222222fffff22222ffff2222222222fffff2222222222222222222222222222222
    222222222222f111111111111111fffffffff222222222222f...f666666666666666666666f....f777fff222222222222222222ffffffffff22222222222222fffffffffff22222222222222222222
    2ffffffff22ff11111111111111111111111f2ffffffffffff...f66666666666666666f666f....f77777ffffff22222222222fff777777777ff2222222222fff777777777fff222222222222222222
    f777777f1fff1111111111111fffffff1111fff7777777777f...f6666666666666666f6ff6f....f7777777777ffffffffffff7777ff77777777fffffffffffffff7777777777fff222222222222222
    7777777f11111ffff11111111f77777ff111f7777777777777f..fffff66666666666f6666fff....f7777777777777777777777fffffff777777777777777ff111f7777777777777ffff2222fffffff
    7777777f1111ff77f11111111f777777f111f7777777777777fff66666ff66666666f666666f.....f777777777777777777777ff11111fff77777777777ff1111f777777777777777777fffff777777
    7777777ff111f777f11111111f777777f111f7777777777777f666666666ff6666ff6666666f.....f777777777fffffffffffff11111111ff7777777777f11111f77777777777777777777777777777
    77777777f111f77ff11111111f777777f111f7777777777777ff6666666666ffff666666666f.....f777777777f9999999999fff11111111f7777777777ff1111ff7777777777777777777777777777
    777777777f1ff7ff111111111f777777f111f77777777777777f6666666666666666666ffff.......f77777777f9999999ff9f7f11111111ff7777777777ffff11fff77777777777777777777777777
    777777777fff77f1111111111f777777f11ff77777777777777f6666666666666666666f.........f777777777f999999fff9f7fff11111111fffffffff7777ff111ff7777777777777777777777777
    7777777777777ff1111111111f777777ffff777777777777777ff666ff6666666666fff.f......ff77777777777fffff9f.f9f777ffffff11111111111fff777f1111f7777777777777777777777777
    7777777777777f11111111111f7777777ff777777777777777777fff..ff666666ff....f.....f77777777777777777f9f.f9ff7777777ff111111111111ff77f1111ff777777777777777777777777
    7777777777777f11111111111f7777777777777777777777777777f.....ff66fff.....f...ff777777777777777777f9fff99f77777777f1111111111111ffff11111f777777777777777777777777
    7777777777777f11111111111f7777777777777777777777777777f.......ff........f.ff777777777777777ffffff999999f77777777ff111111111111111111111f7fffffff7777777777777777
    7777777777777f11111111111f7777777777777777777777777777f..................f77777777777777777f999999f9999f777777777f11111111111111111111fff1111111f777777777777777
    7777777777777f11111111111f7777777777777777777777777777f..................f77777777777777777f99999ff9999f777777777f111111111111111111111f111111111f77777777777777
    7777777777777f11111111111f7777777777777777777777777777f..................f77777777777777777f99999ff9999f77777777ff11111111111111111111f111f1111111f7777777777777
    7777777777777f11111111111f7777777777777777777777777777f........fff.......f77777777777777777fffffffff99ff77777777f111111111111111111111f11ff111ff11f7777777777777
    7777777777777f11111111111f7777777777777777777777777777f.....fff777f......f7777777777777777777777777ff9f77777777ff111111111111111111111f11f11111111f7777777777777
    777777777777f111111111111f777777fff7777777777777777777ff....f77777f.....f777777777777777777777777777fff777777ff1111111111111111111111ff11f111ff111f7777777777777
    7777777777fff1111ffff1111ff77777f1f77777777777777777777fff..f77777f.fffff77777777777777777777777777777777777ff11111111111111111111111ff11f11111111f7777777777777
    777777777ff1111fff77fff111f777ff111f777777777777777777f..f.f777777f.f...f77777777777777777777ffffff77777777ff1111ffffffffffffffffff11ff11111111111f7777777777777
    777777777f1111ff777777f111fffff1111ff77777777777777777ffff.f7777777ffff..f777777777777777777ff99999fff77777f111fff7777777777777777f11ff11111111111f7777777777777
    77777777ff1111f77777777f1111111111ff777777777777777777f..f.f7777777ff..fff77777777777777777ff9999fff9ff7777f111f777777777777777777f11f7f111111111f77777777777777
    77777777f11111f77777777ff1111111fff7777777777777777777ffff.f7777777ff.....f7777777777777777f999999f9f777777f111f777777777777777777f1ff77f1111111f777777777777777
    7777777ff11111f777777777ff11111ff777777777777777777777f.....f7777777f.....f7777777777777777ff999999ffff7777f111f777777777777777777f1f7777fffffff7777777777777777
    7777777ff11111f7777777777fffffff7777777777777777777777f.....f7777777ffff..f77777777777777777fffff99999ff777f111ff77777777777777777f1f777777777777777777777777777
    77777777f1111ff777777777777777777777777777777777777777f......f777777f...fff7777777777777777777777fff999f777ff111f7777777777777777ff1f777777777777777777777777777
    77777777f1111f7777777777777777777777777777777777777777f......f777777f.....f777777777777777777fffffff999f7777ff111ff77777777fffffff11f777777777777777777777777777
    77777777ff1fff7777777777777777777777777777777777777777f.....f77777777f....f777777777777777777f99999999ff77777f1111f7777777ff11111111f777777777777777777777777777
    777777777fff777fffffff77777777ffff77777777777777777777f.....f77777777f....f777777777777777777ff999fffff777777ff11ff7777777ff11111111f777777777777777777777777777
    7777777777ffffff99999fff777f7ff99ff77fff7fff7777777777f....f777777777f....f7777777777777777777fffff77777777777fff7777777777ff1111111f777777777777777777777777777
    7777777777f999999999999f77ff7f9999f77f9fff9f7777777777f...f7777777777f....f777777777777777777777777777777777777f777777777777fffffffff777777777777777777777777777
    7777777777f9fffff99999ff77f9ff9999f77f99ff9f777777777ffff.ff77777777ff...ff77777777777777777777ffffffff777777777777777777777777777777777777777777777777777777777
    7777777777f9ff..f9999ff777ff9f9ff9f77f999f9f777777777f...fff77777777f.fff.f77777777777777777777f999999f777777777777777777777777777777777777777777777777777777777
    7777777777f99ffff9ffff777f9ff99ff9ff7f9f999f77777777ff.....f77777777f.....ff7777777777777777777ffff99ff777777777777777777777777777777777777777777777777777777777
    7777777777f99999999fff777f9f999ff99f7f9ff99f7777777ffff....f77777777f....ffff7777777777777777777ff99ff7777777777777777777777777777777777777777777777777777777777
    7777777777f999ffff999f777f9999f7f99f7f9fffff777777ff...ff..f77777777f..ff...ff777777777777777777f99ffff777777777777777777777777777777777777777777777777777777777
    7777777777f999f77f999f777f9999f7f99f7fff777777777ff......fff77777777fff......ff77777777777777777f99999f7777777ff777777777777777777777777777777777777777777777777
    7777777777f999f77f999f777f9999f7f9ff777777777777ff.........f77777777f.........ff7777777777777777fffffff777777feef77777777777777777777777777777777777777777777777
    7777777777f999f77f999f777ff999f7fff777777777777ff..........f77777777f..........ff7777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777f999f77f999f7777ff9ff777777777777777ffffffffffffff77777777ffffffffffffff777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777ffff777fffff77777fff7777777777777777f..........fff77777777fff..........f777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777ffffffffffff7f77777777f7ffffffffffff777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    `)
scene.setBackgroundImage(img`
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888fffff88888888888888888888888888888888888888888fffff888888888888888888888888888888888888888888888888888888
    888888888888fffff8888888888888888888888888888888888888ff333ff888888888888888888888888888888888888888ff333ff88888888888888888888888888888888888888888888888888888
    88888888888ff333ff888888888888888888888888888888888888fff3333ff888fffffff888888888888888888888888888fff3333ff888fffffff88888888888888888888888888888888888888888
    88888888888fff3333ff888fffffff88888888888888888888888888fff333fffff333333ff888888888888888888888888888fff333fffff333333ff888888888888888888888888888888888888888
    8888888888888fff333fffff333333ff88888888888888888888888888ff333f3333333333ff8888888888888888888888888888ff333f3333333333ff88888888888888888888888888888888888888
    888888888888888ff333f3333333333ff88888888888888888888888888f333333333333333fff888888888888888888888888888f333333333333333fff888888888888888888888888888888888888
    8888888888888888f333333333333333fff8888888888888888888888fff33333333333333333ff888888888888888888888888fff33333333333333333ff88888888888888888888888888888888888
    88888888888888fff33333333333333333ff8888888888888888888fff333333ffffff33333333ff888888888888888888888fff333333ffffff33333333ff8888888888888888888888888888888888
    888888888888fff333333ffffff33333333ff8888888888888888fff33333333333333333333333ff888888888888888888fff33333333333333333333333ff888888888888888888888888888888888
    8888888888fff33333333333333333333333ff888888888888888f3331ff33333333333333333333f888888888888888888f3331ff33333333333333333333f888888888888888888888888888888888
    8888888888f3331ff33333333333333333333f888888888888888f333ff133333333333333333333f888888888888888888f333ff133333333333333333333f888888888888888888888888888888888
    8888888888f333ff133333333333333333333f88888888888888fff33fff33333333333333333333f88888888888888888fff33fff33333333333333333333f888888888888888888888888888888888
    888888888fff33fff33333333333333333333f8888888888888ff333333333333333333333333333f888ff88888888888ff333333333333333333333333333f888ff8888888888888888888888888888
    88888888ff333333333333333333333333333f888ff88888888f3333333333333333333333333333ffffff88888888888f3333333333333333333333333333ffffff8888888888888888888888888888
    88888888f3333333333333333333333333333ffffff88888888f33333333333333333333333333333333ff88888888888f33333333333333333333333333333333ff8888888888888888888888888888
    88888888f33333333333333333333333333333333ff88888888fff333333333333333333333333333ffff888888888888fff333333333333333333333333333ffff88888888888888888888888888888
    88888888fff333333333333333333333333333ffff88888888888ff3333333333333333333333333ff88888888888888888ff3333333333333333333333333ff88888888888888888888888888888888
    8888888888ff3333333333333333333333333ff888888888888888f3333333333333333333333333f8888888888888888888f3333333333333333333333333f888888888888888888888888888888888
    88888888888f3333333333333333333333333f8888888888888888f3333333333333333333333333f8888888888888888888f3333333333333333333333333f888888888888888888888888888888888
    88888888888f3333333333333333333333333f8888888888888888ff333333333333333333333333f8888888888888888888ff333333333333333333333333f888888888888888888888888888888888
    88888888888ff333333333333333333333333f88888888888888888f3333333333ffff3333333333f88888888888888888888f3333333333ffff3333333333f888888888888888888888888888888888
    888888888888f3333333333ffff3333333333f88888888888888888ff3333333fff88ff333333333f88888888888888888888ff3333333fff88ff333333333f888888888888888888888888888888888
    888888888888ff3333333fff88ff333333333f8888888888888888888fff333ff88888f333333333f8888888888888888888888fff333ff88888f333333333f888888888888888888888888888888888
    88888888888888fff333ff88888f333333333f888888888888888888888f333ff88888ff3333333ff888888888888888888888888f333ff88888ff3333333ff888888888888888888888888888888888
    8888888888888888f333ff88888ff3333333ff888888888888888888888f3333f888888f3fffffff8888888888888888888888888f3333f888888f333333ff8888888888888888888888888888888888
    8888888888888888f3333f888888f333333ff8888888888888888888888f3333ff88888fff333ff88888888888888888888888888f3333ff88888ff3333ff88888888888888888888888888888888888
    8888888888888888f3333ff88888ff3333ff88888888888888888888888fffffff8888fffff3333ff888fffffff88888888888888fffffff8888ffffffff888888888888888888888888888888888888
    8888888888888888fffffff8888ffffffff888888888888888888888888888888888888888fff333fffff333333ff8888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888888ff333f3333333333ff888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888888888888888888888888f333333333333333fff8888888888888888888888888888888888888888888888888888888888888888
    888888888888888888888888888888888888888888888888888888888888888888888888888fff33333333333333333ff888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888888888888888888888888fff333333ffffff33333333ff88888888888888888888888888888888888888888888888888888888888888
    888888888fffff888888888888888888888888888888888888888888888888888888888fff33333333333333333333333ff8888888888888888888888888888888888888888888888888888888888888
    88888888ff333ff88888888888888888888888888888888888888888888888888888888f3331ff33333333333333333333f8888888888888888888888888888888888888888888888888888888888888
    88888888fff3333ff888fffffff88888888888888888888888888888888888888888888f333ff133333333333333333333f8888888888888888888888888888888888888888888888888888888888888
    8888888888fff333fffff333333ff88888888888888888888888888888888888888888fff33fff33333333333333333333f888888fffff88888888888888888888888888888888888888888888888888
    888888888888ff333f3333333333ff888888888888888888888888888888888888888ff333333333333333333333333333f888ffff333ff8888888888888888888888888888888888888888888888888
    8888888888888f333333333333333fff8888888888888888888888888888888888888f3333333333333333333333333333fffffffff3333ff888fffffff8888888888888888888888888888888888888
    88888888888fff33333333333333333ff888888888888888888888888888888888888f33333333333333333333333333333333ff88fff333fffff333333ff88888888888888888888888888888888888
    888888888fff333333ffffff33333333ff88888888888888888888888888888888888fff333333333333333333333333333ffff88888ff333f3333333333ff8888888888888888888888888888888888
    8888888fff33333333333333333333333ff888888888888888888888888888888888888ff3333333333333333333333333ff888888888f333333333333333fff88888888888888888888888888888888
    8888888f3331ff33333333333333333333f8888888888888888888888888888888888888f3333333333333333333333333f88888888fff33333333333333333ff8888888888888888888888888888888
    8888888f333ff133333333333333333333f8888888888888888888888888888888888888f3333333333333333333333333f888888fff333333ffffff33333333ff888888888888888888888888888888
    888888fff33fff33333333333333333333f8888888888888888888888888888888888888ff333333333333333333333333f8888fff33333333333333333333333ff88888888888888888888888888888
    88888ff333333333333333333333333333f888ff888888888888888888888888888888888f3333333333ffff3333333333f8888f3331ff33333333333333333333f88888888888888888888888888888
    88888f3333333333333333333333333333ffffff88888888888888888888fffff88888888ff3333333fff88ff333333333f8888f333ff133333333333333333333f88888888888888888888888888888
    88888f33333333333333333333333333333333ff888888888888888888fff....fff8888888fff333ff88888f333333333f888fff33fff33333333333333333333f88888888888888888888888888888
    88888fff333333333333333333333333333ffff88888888888888888fff........fff8888888f333ff88888ff3333333ff88ff333333333333333333333333333f888ff888888888888888888888888
    8888888ff3333333333333333333333333ff8888888888888888888ff............f8888888f3333f888888f333333ff888f3333333333333333333333333333ffffff888888888888888888888888
    88888888f3333333333333333333333333f8888888888888888888ff.....fff.....ff888888f3333ff88888ff3333ff8888f33333333333333333333333333333333ff888888888888888888888888
    88888888f3333333333333333333333333f8888888888888888888f......f.f......ff88888fffffff8888ffffffff88888fff333333333333333333333333333ffff8888888888888888888888888
    88888888ff333333333333333333333333f8888888888888888ffff......f.f.......f8888888888888888888888888888888ff3333333333333333333333333ff8888888888888888888888888888
    888888888f3333333333ffff3333333333f888888888888888ff.f....ffff.fff.....f88888888888888888888888888888888f3333333333333333333333333f88888888888888888888888888888
    888888888ff3333333fff88ff333333333f888888888888888f......ff......ff....ff8888888888888888888888888888888f3333333333333333333333333f88888888888888888888888888888
    88888888888fff333ff88888f333333333f888888888888888f......f........fff...ff888888888888888888888888888888ff333333333333333333333333f88888888888888888888888888888
    8888888888888f333ff88888ff3333333ff888888888888888f.....ff..........f...ff8888888888888888888888888888888f3333333333ffff3333333333f88888888888888888888888888888
    8888888888888f3333f888888f333333ff8888888888888888f...fff...........f....f8888888888888888888888888888888ff3333333fff88ff333333333f88888888888888888888888888888
    8888888888888f3333ff88888ff3333ff88888888888888888f...f.............f....f888888888888888888888888888888888fff333ff88888f333333333f88888888888888888888888888888
    8888888888888fffffff8888ffffffff888888888888888888f...f.............f....f88888888888888888888888888888888888f333ff88888ff3333333ff88888888888888888888888888888
    88888888888888888888888888888888888888888888888888f...f...ff....ff..f....f88888888888888888888888888888888888f3333f888888f333333ff888888888888888888888888888888
    88888888888888888888888888888888888888888888888888f...f...ff....ff...f...f88888888888888888888888888888888888f3333ff88888ff3333ff8888888888888888888888888888888
    88888888888888888888888888888888888888888888888888f...f...ff....ff...f...ff8888888888888888888888888888888888fffffff8888ffffffff88888888888888888888888888888888
    88888888888888888888888888888888888888888888888888f...f..............f....f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888f...f..............ff...ff888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888f...fff.............f....ff88888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888f.....f............f......ff8888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888fffff888888888888888888888888888888888fff.....ffff.........f.......ff888888888888888888888888888888888888888888888888888888888888888888888888888888888
    888888888ff333ff8888888888888888888888888888888ff..........fff...fffff.fffff..ff88888888888888888888888888888888888888888888888888888888888888888888888888888888
    888888888fff3333ff888fffffff8888888888888888888f.............f...f.....f888ff..ff8888888888888888888888fffff8888888888888888888888888888888888888888888888888888
    88888888888fff333fffff333333ff8888888888888888ff...fff..ffffff...ffffff.f888ff..f888888888888888888888ff333ff888888888888888888888888888888888888888888888888888
    8888888888888ff333f3333333333ff888888888888888f....ff...f....f...f....f.ff888f.ff888888888888888888888fff3333ff888fffffff888888888888888888888888888888888888888
    88888888888888f333333333333333fff8888888888888ffffff...ff....fffff....f..fff8fff888888888888888888888888fff333fffff333333ff8888888888888888888888888888888888888
    888888888888fff33333333333333333ff88888888888888888f..fff.............ff...f888888888888888888888888888888ff333f3333333333ff888888888888888888888888888888888888
    8888888888fff333333ffffff33333333ff8888888888888888f.ff.f.....666.....ffffff8888888888888888888888888888888f333333333333333fff8888888888888888888888888888888888
    88888888fff33333333333333333333333ff888888888888888fff..f.666.666..666f888ff88888888888888888888888888888fff33333333333333333ff888888888888888888888888888888888
    88888888f3331ff33333333333333333333f888888888888888888fff.666.666..666fff888888888888888888888888888888fff333333ffffff33333333ff88888888888888888888888888888888
    88888888f333ff133333333333333333333f888888888888888888f...666......666..f8888888888888888888888888888fff33333333333333333333333ff8888888888888888888888888888888
    8888888fff33fff33333333333333333333f88888888888888888ff.................ff888888888888888888888888888f3331ff33333333333333333333f8888888888888888888888888888888
    888888ff333333333333333333333333333f888ff88888888888ff.........666.......ff88888888888888888888888888f333ff133333333333333333333f8888888888888888888888888888888
    888888f3333333333333333333333333333ffffff88888888888f..........666........f8888888888888888888888888fff33fff33333333333333333333f8888888888888888888888888888888
    888888f33333333333333333333333333333333ff888888888fffffffff....666.fffffffff88888888888888888888888ff333333333333333333333333333f888ff88888888888888888888888888
    888888fff333333333333333333333333333ffff8888888888f.......f........f.......f88888888888888888888888f3333333333333333333333333333ffffff88888888888888888888888888
    88888888ff3333333333333333333333333ff8888888888888f.......f.666....f.......f88888888888888888888888f33333333333333333333333333333333ff88888888888888888888888888
    888888888f3333333333333333333333333f88888888888888f.......f.666....f.......f88888888888888888888888fff333333333333333333333333333ffff888888888888888888888888888
    888888888f3333333333333333333333333f88888888888888f.......f.666....f.......f8888888888888888888888888ff3333333333333333333333333ff888888888888888888888888888888
    888888888ff333333333333333333333333f88888888888888f.......f........f.......f88888888888888888888888888f3333333333333333333333333f8888888888888888888888888888888
    8888888888f3333333333ffff3333333333f88888888888888f.......f........f.......f88888888888888888888888888f3333333333333333333333333f8888888888888888888888888888888
    8888888888ff3333333fff88ff333333333f88888888888888f.......f........f.......f88888888888888888888888888ff333333333333333333333333f8888888888888888888888888888888
    888888888888fff333ff88888f333333333f88888888888888ffff..fffffffffffffff..fff888888888888888888888888888f3333333333ffff3333333333f8888888888888888888888888888888
    88888888888888f333ff88888ff3333333ff88888888888888888f..f.............f..f88888888888888888888888888888ff3333333fff88ff333333333f8888888888888888888888888888888
    88888888888888f3333f888888f333333ff888888888888888888ffff.............ffff8888888888888888888888888888888fff333ff88888f333333333f8888888888888888888888888888888
    88888888888888f3333ff88888ff3333ff8888888888888888888888f.............f888888888888888888888888888888888888f333ff88888ff3333333ff8888888888888888888888888888888
    88888888888888fffffff8888ffffffff88888888888888888888888f.............f888888888888888888888888888888888888f3333f888888f333333ff88888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....fffff....f888888888888888888888888888888888888f3333ff88888ff3333ff888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f888888888888888888888888888888888888fffffff8888ffffffff8888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f....f...f....f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    88888888888888888888888888888888888888888888888888888888f..fff....fff.f88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888ffffffffff....fffffffff8888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888f...f..fff....fff..f..f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    8888888888888888888888888888888888888888888888888888f...f..fff....fff..f..f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    888888888888888888888888888888888888888888888888888fffffffffff....ffffffffff888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    888888888888888888888888888888888888888888888888888f.........f....f........f888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    888888888888888888888888888888888888888888888888888fffffffffff....ffffffffff888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    `)
scene.setBackgroundImage(img`
    66666666666666666666666666666666666666666666666666666666666666666f555555555555555f7f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    66666666666666666666666666666666666666666666666666666666666666666ff5555555555555f77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    666ffff666666666ffff66666fffffff6666666fffffff6666ff6ffffffff666666ff5555555555ff77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    666f77f66666666f777f666ff7777777ff66666f777777f6ff7f6f777777f6666666ff5555555ff7f77f77777777666667777777777fdddddddddddddf7777777777777777777777777f555555555555
    666f77f66666666f777f66f77777777777f6666f777777f6f77f6f7ffffff6666666ff555555ff77f77f77777776777776777777777fdddddddddddddf7777777766666777777777777f555555555555
    666f777f666666f7777f66f77fffffff77f6666f777fff7ff77f6f7f666666666666f555555ff777f77f77777776777776777777777fdddddddddddddf7777777677777677777777777f555555555555
    666f7777f66666f7777f6f77f6666666f77f666f777f6f77f77f6f7f666666666666f55555fff777f77f77777776777777777777777fdddddddddddddf7777777677777677777777777f555555555555
    666f7777f66666f7777f6f77f6666666f77f666f777f6f77f77f6f7ffff666666666f5555f7ff777f77f77777776777777777777777fdddddddddddddf7777777677777777777777777f555555555555
    666f77777f666f77777f6f77f6666666f77f666f777f66f7f77f6f7777f66666666ff555f77ff777f77f77777777666667777777777fdddddddddddddf7777777677777777777777777f555555555555
    666f777f77ffff77777f6f77f6666666f77f666f777f66f7777f6f7ffff66666666f555f777ff777f77f77777777777776777777777fdddddddddddddf7777777766666777777777777f555555555555
    666f77f6f77777f7777f6f77f6666666f77f666f777f66f7777f6f7f66666666666f555f777ff777f77f77777777777776777777777fdddddddddddddf7777777777777677777777777f555555555555
    666f77f6f7777ff7777f6f77f6666666f77f666f777f66f7777f6f7f6666666666ff55ff777ff777f77f77777777777776777777777fdddddddddddddf7777777777777677777777777f555555555555
    666f77f66f77f6f7777f6f77f6666666f77f666f777f666f777f6f7ffffff66666f55f7f777ff777f77f77777776777776777777777fdddddddddddddf7777777777777677777777777f555555555555
    666f77f666ff66f7777f66f77fffffff77f6666f777f666f777f6f777777f66666f5f77f777ff777f77f77777776777776777777777fdddddddddddddf7777777677777677777777777f555555555555
    666f77f6666666f7777f66f77777777777f6666f777f666f777f6f777777f66666ff777f777ff777f77f77777777666667777777777fdddddddddddddf7777777677777677777777777f555555555555
    666ffff6666666ffffff666ff7777777ff66666fffff666fffff6ffffffff66666ff777f777ff777f77f77777777777777777777777fdddddddddddddf7777777766666777777777777f555555555555
    6666666666666666666666666fffffff6666666666666666666666666666666666ff777f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    66666666666666666666666666666666666666666666666666666666666666666fff777f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    6666666666666666666666666666666666666666666666666666666666666666ff5f777f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    66666666666666666666666666666666666666666666666666666666666ffffff55f777f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    6666666666666666666666fff6666fff666666666666666fffffffffffff5555555f777f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    6666666666666666666666f7f6666f7f666666666666ffff5555555555555555555f777f777ff777f77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff555555555555
    6666666666666666666666f7f6666f7f6666666666fff5555555555555555555555f777f777ff777fff777777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    6666666666666666666666f77ffff77f66666666fff555555555555555555555555f777f777ff777f77777777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555
    6666666666666666666666f77777777f6666666ff55555555555555555555555555f777f777ff7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff5555555555555
    66666666666666666666666ff7777ff666666fff555555555555555555555555555f777f777fff77777777777777777777777777777fdddddddddddddf77777777777777777777777f55555555555555
    666666666666666666666666ff77ff666666fff5555555555555555555555555555f777f777fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff55555555555555
    666666666666fffff66666666f77f666666ff555555555555555555555555555555f777f777f7777fff7777777777777777777fdddddddddddddf7777777777777777777777777f55555555555555555
    66666666666fff55ff6666666f77f666666ff555555555555555555555555555555f777f7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff555555555555555555
    6666666666ff55555f6666666f77f6666666ff55555555555555555555555555555f777ff77777777777777777777777777777fdddddddddddddf77777777777777777777777f5555555555555555555
    6666666666f555555f6666666f77f66666666f55555555555555555555555555555f777ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5555555555555555555
    6666666666f555555ff666666f77f66666666f55555555555555555555555555555f777fff7fff77777777777777777777fdddddddddddddf7777777777777777777777777f555555555555555555555
    666666666ff5555555f666666f77f66666666f55555555555555555555555555555f777f77777777777777777777777777fdddddddddddddf7777777777777777777777777f555555555555555555555
    66666666ff55555555f666666f77f66666666f55555555555555555555555555555f7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff5555555555555555555555
    66666666f555555555fff6666ffff6666666ff55555555555555555555555555555ff77777777777777777777777777777fdddddddddddddf77777777777777777777777f55555555555555555555555
    666666fff55555555555ff666666666666fff5555555555555555555555555555555fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff55555555555555555555555
    fffffff55555555555555ffffffffffffff555555555555555555555555555555555555fff55555555555555555555555555555555555555555555555555555555555555555555555555555555555555
    5555555555555555555555555555555555555555555555555555ffff5555fffff5555fffeff55555555555555555555fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    5555555555555555555555555555555555555555555555555555feeffffffeeefff5ffeeeef5555555555555555555f7f77777777777777777777777fdddddddddddddf7777777777777777777777777
    5555555555555555555555555555555555555555555555555555ffeeeeeeeeeeeefffeeeeef555555555555555555f77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    5555555555555555555555555555555555555555555555555f555feeeeeeeeeeeeeeeeeeeef55555555555555555ff77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    555555555555555555555555555555555555555555555555fff5feeeeeeeeeeeeeeeeeeeeefff55555555555555f7f77f77777777666667777777777fdddddddddddddf7777777777777777777777777
    555555555555555555555555555555555555555555555555eeffeeeeeeeeeeeeeeeeeeeeeeeefff55555555555f77f77f77777776777776777777777fdddddddddddddf7777777766666777777777777
    555555555555555555555555555555555555555555555555feeeeeeefffffffffffffffeeeeeeeff555555555f777f77f77777776777776777777777fdddddddddddddf7777777677777677777777777
    55555555555555555fffffffffffffffffffffffff555555feeeeeef11111111111111feeeeeeeef555555555f777f77f77777776777777777777777fdddddddddddddf7777777677777677777777777
    555555555555fffff77f777777777777777777777f555555feeeeff1111111111111111fffeeeeff555555555f777f77f77777776777777777777777fdddddddddddddf7777777677777777777777777
    55555555555f77fff77f777777777777777777777f555555feeef11111ffffffffffff111feeeff555555555ff777f77f77777777666667777777777fdddddddddddddf7777777677777777777777777
    555555ffffff77f7f77f777777777777777777777f555555eeef11111f............fffffeeff55555555f7f777f77f77777777777776777777777fdddddddddddddf7777777766666777777777777
    55555f77ff7f77f7f77f777777777777777777777f555555ffff111ff................ffeeef5555555f77f777f77f77777777777776777777777fdddddddddddddf7777777777777677777777777
    555fff77ff7f77f7f77f777777777777777777777f555555ffff11ff..........fffff...ffeeff555555f77f777f77f77777777777776777777777fdddddddddddddf7777777777777677777777777
    555f7f77ff7f77f7f77f777777777777777777777f5555555f5fff....ffff...fff1fff...ffff5555555f77f777f77f77777776777776777777777fdddddddddddddf7777777777777677777777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555f.....ff1fff..fffffff...ff555555555f77f777f77f77777776777776777777777fdddddddddddddf7777777677777677777777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555ffffffffffffffff1fffffff.f555555555f77f777f77f77777777666667777777777fdddddddddddddf7777777677777677777777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555fff...ffff1f..fffffff.ffff55555555ff77f777f77f77777777777777777777777fdddddddddddddf7777777766666777777777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555f.fff.ffffff...fffff..f..f5555555f7f77f777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555f...f..ffff...........f..f5555555f7f77f777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777777666667776677777f555555555f...f................ff..f5555555f7f77f777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777776777776777767777f555555555ff..f...........e....f..ff5555555f7f77f777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777776777776777767777f5555555555ffff.....eeeeee.....f.ff55555555f7f77f777f77f77777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777776777776777767777f555555555555fff...............fff555555555f7f77f777f77ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    555f7f77ff7f77f7f77f777776777776777767777f55555555555555ff.............ff55555555555f7f77f777fff777777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777776777776777767777f555555555555555ff..........fff555555555555f7f77f777f77777777777777777777777777fdddddddddddddf7777777777777777777777777
    555f7f77ff7f77f7f77f777777667777666677777f5555555555555555fffff.....ff55555555555555f7f77f7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff
    555f7f77ff7f77f7f77f777777777777777777777f55555555555555555555f.....f555555555555555f7f77ff77777777777777777777777777777fdddddddddddddf77777777777777777777777f5
    555f7f77ff7f77f7f77f777777777777777777777f55555555555555555555f.....f555555555555555f7f777fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5
    555f7f77ff7f77f7f77f777777777777777777777f55555555555555555555f.....f555555555555555f7f777ffffff777777777777777777777fdddddddddddddf7777777777777777777777777f55
    555f7f77ff7f77f7f77f777777777777777777777f55555555555ffffffffff.....fffff55555555555f7f777f77777777777777777777777777fdddddddddddddf7777777777777777777777777f55
    555f7f77ff7f77f7f77f777777777777777777777f5555555555f.........f.....f...fff555555555f7f7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff555
    555f7f77ff7f77f7f77f777777777777777777777f555555555f...........fffff......fff5555555f7ff77777777777777777777777777777fdddddddddddddf77777777777777777777777f5555
    555f7f77ff7f77f7f77f777777777777777777777f55555555f.........................f5555555f77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5555
    555f7f77ff7f77ffffffffffffffffffffffffffff55555555f................fffff....f5555555f777f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5555
    555f7f77fffffffddddfdddddddddddddddddddddf55555555f................f555f....f5555555f777fff777777777777777777777777fdddddddddddddf7777777777777777777777777f5555
    555f7f77ffddddfddddfdddddddddddddddddddddf5555555f.................ff5ff.....f555555f777f77777777777777777777777777fdddddddddddddf7777777777777777777777777f5555
    555fffffffddddfddddfdddddddddddddddddddddf5555555f..................f5f..f...f555555f7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff55555
    555fddddffddddfddddfdddddddddddddddddddddf5555555f..................fff..f....f55555ff77777777777777777777777777777fdddddddddddddf77777777777777777777777f555555
    555fddddffddddfddddfdddddddddddddddddddddf555555f.....fff................f....f555555fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    555fddddffddddfddddfdddddddddddddddddddddf555555f.....f.f................ffffff555555555fff555555f7f77777777777777777777777fdddddddddddddf7777777777777777777777
    555fddddffddddfddddfdddddddddddddddddddddf555555f.....f.f................f....f55555555555555555f77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555fddddffddddfddddfdddddddddddddddddddddf55555f......f.f................f....f5555555555555555ff77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555fddddffddddfddddfdddddddddddddddddddddf55555f....fff.ffff.............f....f555555555555555f7f77f77777777666667777777777fdddddddddddddf7777777777777777777777
    555fddddffddddfddddfdddddddddddddddddddddf55555f...ff......f.............f....f55555555555555f77f77f77777776777776777777777fdddddddddddddf7777777766666777777777
    555fddddffddddfddddfdddddddddddddddddddddff5555fffff.....eef.............f....f5555555555555f777f77f77777776777776777777777fdddddddddddddf7777777677777677777777
    555fddddffddddfddddfdddddddddddddddddddddff5555ff..........f.............f....f5555555555555f777f77f77777776777777777777777fdddddddddddddf7777777677777677777777
    555fddddffddddfddddfdddddddddddddddddddddff5555f.........eef.............f....f555555555555ff777f77f77777776777777777777777fdddddddddddddf7777777677777777777777
    555fddddffddddffffffffffffffffffffffffffff55555f..........ef.............f....ff5555555555fff777f77f77777777666667777777777fdddddddddddddf7777777677777777777777
    555fddddfffffff7f77f777777777777777777777f55555fff..ffffffff.............f.....f555555555f7ff777f77f77777777777776777777777fdddddddddddddf7777777766666777777777
    555fddddff7f77f7f77f777777777777777777777ff555555ffff.f..................f.....f55555555f77ff777f77f77777777777776777777777fdddddddddddddf7777777777777677777777
    555fffffff7f77f7f77f777777777777777777777ff5555555555f...................f.f...f5555555f777ff777f77f77777777777776777777777fdddddddddddddf7777777777777677777777
    555f7f77ff7f77f7f77f777777777777777777777ff555555555f....................f.f...f5555555f777ff777f77f77777776777776777777777fdddddddddddddf7777777777777677777777
    555f7f77ff7f77f7f77f777777777777777777777f5555555555f....................f....ff5555555f777ff777f77f77777776777776777777777fdddddddddddddf7777777677777677777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555f.....................ffffff55555555f777ff777f77f77777777666667777777777fdddddddddddddf7777777677777677777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555fffffffffffffffffffffff5555555555555f777ff777f77f77777777777777777777777fdddddddddddddf7777777766666777777777
    555f7f77ff7f77f7f77f777777777777777777777f55555555555f....................f555555555555f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777777777777777777f55555555555f..........f.........f555555555555f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777766666777667777f55555555555f..........ff........f555555555555f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777677777677776777f5555555555f..f.......fff.........f55555555555f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777677777677776777f5555555555f.f5f......fff.........f55555555555f777ff777f77f77777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777677777677776777f5555555555f..f.......fff.........f55555555555f777ff777f77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    555f7f77ff7f77f7f77f777777677777677776777f5555555555f.........fffff........f55555555555f777ff777fff777777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777677777677776777f555555555f..........fffff.........f5555555555f777ff777f77777777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777766777766667777f555555555ffffffffffffffffffffffffff5555555555f777ff7ff7fffffffffffffffffffffffffffdddddddddddddfffffffffffffffffffffff
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555f777fff77777777777777777777777777777fdddddddddddddf7777777777777777777777
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555f777f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555f777f77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555f777fff777777777777777777777777fdddddddddddddf7777777777777777777777777f5
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555f777f77777777777777777777777777fdddddddddddddf7777777777777777777777777f5
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555f7ff7fffffffffffffffffffffffffffdddddddddddddffffffffffffffffffffffffff55
    555f7f77ff7f77f7f77f777777777777777777777f555555555555f...f5555555555f...f5555555555555ff77777777777777777777777777777fdddddddddddddf77777777777777777777777f555
    555f7f77ff7f77f7f77fffffffffffffffffffffff55555555555fffffff55555555fffffff5555555555555fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff555
    555f7f77ff7f7ff7f7f7777777777777777777777f55555555555f.....f55555555f.....f5555555555555555fff555555555555555555555555555555555555555555555555555555555555555555
    555f7f77ff7f7ff7f7f777777777777777777777f55555555555ff.....f55555555f.....ff555555555555555555555555555555555555555555555555555555555555555555555555555555555555
    555f7f7fff7f7ff77fffffffffffffffffffffff55555555555ffff....f55555555f....ffff55555555555555555555555555555555555555555555555555555555555555555555555555555555555
    55ff7f7fff77fff7f777777777777777777777f55555555555ff...ff..f55555555f..ff...ff5555555555555555555555555555555555555555555555555555555555555555555555555555555555
    55ff7f7fff7f77f7f77777777777777777777f55555555555ff......fff55555555fff......ff555555555555555555555555555555555555555555555555555555555555555555555555555555555
    55ff77ffff7f77ff77777777777777777777f55555555555ff.........f55555555f.........ff55555555555555555555555555555555555555555555555555555555555555555555555555555555
    555f7f77fff7777fffffffffffffffffffff55555555555ff..........f55555555f..........ff5555555555555555555555555555555555555555555555555555555555555555555555555555555
    555f7f77fffffffffffffffffffffff555555555555555ffffffffffffff55555555ffffffffffffff555555555555555555555555555555555555555555555555555555555555555555555555555555
    555ff7777fffffffffffffffffffff5555555555555555f..........fff55555555fff..........f555555555555555555555555555555555555555555555555555555555555555555555555555555
    5555fffffffffffffffffffff555555555555555555555ffffffffffff5f55555555f5ffffffffffff555555555555555555555555555555555555555555555555555555555555555555555555555555
    5555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
    `)
scene.setBackgroundImage(img`
    99999999999999999999999999999999999999999999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999999999999999999999999999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    999999999999999999999999999999999999ffff9999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999999999999999999f999f9999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    9999999999999999999999999999999999f9999f9999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999ffff999999999f99999f9999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999f22f99999999f99ff99f9999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999f22f99999999f9f9f99f9999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999f22f99999999fff9f99f9999999999999999999999999f88888888888888888888888888888888888888ffff8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f999999999999f99f9999999999999999999999999f8888888888888888888888888888888888888f999f8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f999999999999f99f9999999999999999999999999f888888888888888888888888888888888888f9999f8888888888888888888888888888888888888888888888888888
    999999999999999ffffff22ffffff9999999f99f9999999999999999999999999f8888888888888888888888ffff888888888f99999f8888888888888888888888888888888888888888888888888888
    999999999999999f222222222222f9999999f99f9999999999999999999999999f8888888888888888888888f22f88888888f99ff99f8888888888888888888888888888888888888888888888888888
    999999999999999f222222222222f9999999f99f9999999999999999999999999f8888888888888888888888f22f88888888f9f8f99f8888888888888888888888888888888888888888888888888888
    999999999999999ffffff22ffffff9999999f99f9999999999999999999999999f8888888888888888888888f22f88888888fff8f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f999999999999f99f9999999999999999999999999f8888888888888888888888f22f888888888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f999999999999f99f9999999999999999999999999f8888888888888888888888f22f888888888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f999999999999f99f9999999999999999999999999f88888888888888888ffffff22ffffff8888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f999999999999f99f9999999999999999999999999f88888888888888888f222222222222f8888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999f22f99999999999ffffff999999999999999999999999f88888888888888888f222222222222f8888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999ffff99999999999999999999999999999999999999999f88888888888888888ffffff22ffffff8888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999999999999999999999999999999999999999999999999f8888888888888888888888f22f888888888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999999999999999999999999999999999999999999999999f8888888888888888888888f22f888888888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999999999999999999999999999999999999999999999999f8888888888888888888888f22f888888888888f99f8888888888888888888888888888888888888888888888888888
    9999999999999999999999999ffffffff99999999999999999999999999999999f8888888888888888888888f22f888888888888f99f8888888888888888888888888888888888888888888888888888
    99999999999999999999999ff5555555fff999999999999999999999999999999f8888888888888888888888f22f88888888888ffffff888888888888888888888888888888888888888888888888888
    99999999999999999999999f5555555555fff9999999999999999999999999999f8888888888888888888888ffff88888888888888888888888888888888888888888888888888888888888888888888
    9999999999999999999999ff555555555555f9999999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    999999999999999999999ff5555555555555ff999999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999ff555ffffffff5555f999999999999999999999999999f8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
    99999999999999999999f5555f999999ff555f999999999999999999999999999f888888888888888888888888888ffffffff88888888888888888888888888888888888888888888888888888888888
    99999999999999999999f5555f9999999ff55f999999999999999999999999999f8888888888888888888888888ff5555555fff888888888888888888888888888888888888888888888888888888888
    99999999999999999999f555ff99999999ff5f999999999999999999999999999f8888888888888888888888888f5555555555fff8888888888888888888888888888888888888888888888888888888
    9999999999999999999ff555f9999999999f5f999999999999999999999999999f888888888888888888888888ff555555555555f8888888888888888888888888888888888888888888888888888888
    9999999999999999999f5555f9999999999f5f999999999999999999999999999f88888888888888888888888ff5555555555555ff888888888888888888888888888888888888888888888888888888
    9999999999999999999f5555f9999999999f5f999999999999999999999999ffffff88888888888888888888ff555ffffffff5555f888888888888888888888888888888888888888888888888888888
    9999999999999999fffffffffffffffffffffff9999999999999999999999ffeeeeef8888888888888888888f5555f888888ff555f888888888888888888888888888888888888888888888888888888
    9999999999999999f333333333333333333333ffff99999999999999999ffeeeeeeeefffffff888888888888f5555f8888888ff55f888888888888888888888888888888888888888888888888888888
    9999999999999999f33333333333333333333333ff9999999999fffffffeeeeeeeeeeeeeeeeff88888888888f555ff88888888ff5f8888888888888888888888888888ffff8888888888888888888888
    9999999999999999f33333333333333333333333f99999999999feeeeeeeeeeeeeeeeeeeeffff8888888888ff555f8888888888f5f888888888888888888888888888f444f8888888888888888888888
    9999999999999999f33333333333333333333333f9999999999ffeeeeeeeeeeeeeeeeeeffff888888888888f5555f8888888888f5f88888888888888888888888888f4444f8888888888888888888888
    9999999999999999f3333aaaaaaaaaaaaaaaa333f9999999999fffffeeeeeeeeeeeeeeeeeeff88888888888f5555f8888888888f5f888888888888ffff888888888f44444f8888888888888888888888
    9999999999999999f3333aaaaaaaaaaaaaaaa333f99999999999999feeeeeeeeeeeeeeeeeefff8888888fffffffffffffffffffffff88888888888f77f88888888f44ff44f8888888888888888888888
    9999999999999999f3333aaaaaaaaaaaaaaaa333f99999999999999feefffeeeeeeeeeeeeeff88888888f333333333333333333333ffff88888888f77f88888888f4f8f44f8888888888888888888888
    9999999999999999f3333aaaaaaaaaaaaaaaa333f9999999999999ffeef.ffeeeeeeeeeeeeeeff888888f33333333333333333333333ff88888888f77f88888888fff8f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333f999999999999ffeeef..ffeeefffeefffeeeff88888f33333333333333333333333f888888888f77f888888888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333f99999999999ffeeeef...feeff..fef.ffeeef88888f33333333333333333333333f888888888f77f888888888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333f9999999999fffeffef...feef....ff..feeeff8888f3333aaaaaaaaaaaaaaaa333f8888ffffff77ffffff8888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333f9999999999feeefffff..ffff....f...feeeef8888f3333aaaaaaaaaaaaaaaa333f8888f777777777777f8888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333f9999999999fefff..................ffeeeff888f3333aaaaaaaaaaaaaaaa333f8888f777777777777f8888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333f9999999999fff.ff.................fffff.f888f3333aaaaaaaaaaaaaaaa333f8888ffffff77ffffff8888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa33333333ff999999999ff.fff.................f888fff888f3333333333aaaaa33333333f888888888f77f888888888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa333333333f99999999999f..ff................f888888888f3333333333aaaaa33333333f888888888f77f888888888888f44f8888888888888888888888
    9999999999999999f3333333333aaaaa333333333f99999999999f...f................f888888888f3333333333aaaaa33333333f888888888f77f888888888888f44f8888888888888888888888
    9999999999999999f333333333333333333333333f99999999999f...f................f888888888f3333333333aaaaa33333333f888888888f77f888888888888f44f8888888888888888888888
    9999999999999999f333333333333333333333333fffffffffffff...ff...............fffffffffff3333333333aaaaa33333333f888888888f77f88888888888ffffff888888888888888888888
    9999999999999999f333333333333333333333333faaaaaaaaaaaff.ff................f333333333f3333333333aaaaa33333333ffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffff333333333333333333333333faaaaaaaaaaaafff.................f333333333f3333333333aaaaa33333333ff33333333333333333333333333333333333333333333333333
    aaaaaaaaaaaaaaaaf333333333333333333333333faaaaaaaaaaaaaafff.............fff333333333f3333333333aaaaa333333333f33333333333333333333333333333333333333333333333333
    aaaaaaaaaaaaaaaaffffffffffffffffffffffffffaaaaaaaaaaaaaaaafff........ffff33333333333f3333333333aaaaa333333333f33333333333333333333333333333333333333333333333333
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaffffffffff33333333333333f333333333333333333333333f3333333333333ffffffff33333333333333333333333333333
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf....f333333333333333333f333333333333333333333333f33333333333ff5555555fff333333333333333333333333333
    aaaaaaaaaaaaaaaaaaaaaffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf.....f333333333333333333f333333333333333333333333f33333333333f5555555555fff3333333333333333333333333
    aaaaaaaaaaaaaaaaaaaaf444faaaaaaaaaaaaaaaaaaaaaaaaaaaaaafffff.....ffffff3333333333333f333333333333333333333333f3333333333ff555555555555f3333333333333333333333333
    aaaaaaaaaaaaaaaaaaaf4444faaaaaaaaaaaaaaaaaaaaaaaaaaaafff...f.....f.....fff3333333333f333333333333333333333333f333333333ff5555555555555ff333333333333333333333333
    aaaaaffffaaaaaaaaaf44444faaaaaaaaaaaaaaaaaaaaaaaaaaaaf......fffff........f3333333333ffffffffffffffffffffffffff33333333ff555ffffffff5555f333333333333333333333333
    aaaaaf77faaaaaaaaf44ff44faaaaaaaaaaaaaaaaaaaaaaaaaaaff...................f3333333333333333333333333333333ffff333333333f5555f333333ff555f333333333333333333333333
    aaaaaf77faaaaaaaaf4faf44faaaaaaaaaaaaaaaaaaaaaaaaaaaf....................f333333333333333333333333333333f444f333333333f5555f3333333ff55f333333333333333333333333
    aaaaaf77faaaaaaaafffaf44faaaaaaaaaaaaaaaaaaaaaaaaaff..................f...f3333333333333333333333333333f4444f333333333f555ff33333333ff5f333333333333333333333333
    aaaaaf77faaaaaaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaaaff....f...............f..f33333333333333ffff333333333f44444f33333333ff555f3333333333f5f333333333333333333333333
    aaaaaf77faaaaaaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaaaff...f...1........1...f..f33333333333333f33f33333333f44ff44f33333333f5555f3333333333f5f333333333333333333333333
    ffffff77ffffffaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaaafff..f....1......1.....f..f3333333333333f33f33333333f4f3f44f33333333f5555f3333333333f5f333333333333333333333333
    f777777777777faaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaaff.f..f..111111111111...f...f333333333333f33f33333333fff3f44f33333fffffffffffffffffffffff33333333333333333333333
    f777777777777faaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaff..ffff..1.1f111f11.1....f..f333333333333f33f333333333333f44f33333f222222222222222222222ffff33333333333333333333
    ffffff77ffffffaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaf.....ff..1.11111111.1....fff.f33333333333f33f333333333333f44f33333f22222222222222222222222ff33333333333333333333
    aaaaaf77faaaaaaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaf......f....11111111......f...f333333ffffff33ffffff3333333f44f33333f22222222222222222222222f333333333333333333333
    aaaaaf77faaaaaaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaf......f......1..1........f...f333333f333333333333f3333333f44f33333f22222222222222222222222f333333333333333333333
    aaaaaf77faaaaaaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaff.....ff....1....1.......f...f333333f333333333333f3333333f44f33333f22228888888888888888222f333333333333333333333
    aaaaaf77faaaaaaaaaaaaf44faaaaaaaaaaaaaaaaaaaaaaaff.....f.................f...f333333ffffff33ffffff3333333f44f33333f22228888888888888888222f333333333333333333333
    aaaaaf77faaaaaaaaaaaffffffaaaaaaaaaaaaaaaaaaaaaaaf.....f.................f...f33333333333f33f333333333333f44f33333f22228888888888888888222f333333333333333333333
    aaaaaffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaff....ff................f...f33333333333f33f333333333333f44f33333f22228888888888888888222f333333333333333333333
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaff....f................f...f33333333333f33f333333333333f44f33333f22222222228888822222222f333333333333333333333
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf....fff..............f...f33333333333f33f333333333333f44f33333f22222222228888822222222f333333333333333333333
    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaff.....ff..ffff.......f...f33333333333f33f33333333333ffffff3333f22222222228888822222222f333333333333333333333
    aaaaaaaaaaffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafff..ffffff..ffffff..f...f33333333333ffff333333333333333333333f22222222228888822222222f333333333333333333333
    aaaaaaaaff5555555fffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaffffff...........fff...f333333333333333333333333333333333333f22222222228888822222222f333333333333333333333
    aaaaaaaaf5555555555fffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf..................f..f3333333333333333333333333333333333333f22222222228888822222222f333333333333333333333
    aaaaaaaff555555555555faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf..................f..f3333333333333333333333333333333333333f22222222228888822222222ff33333333333333333333
    aaaaaaff5555555555555ffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf........ff........f..f33333333333333333ffffffff333333333333f222222222288888222222222f33333333333333333333
    aaaaaff555ffffffff5555faaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf.........ff.........f.f333333333333333ff5555555fff3333333333f222222222288888222222222f33333333333333333333
    aaaaaf5555faaaaaaff555faaaaaaaaaaaaaaaaaaaaaaaaaaaaaf..........ff.........ff3333333333333333f5555555555fff33333333f222222222222222222222222f33333333333333333333
    aaaaaf5555faaaaaaaff55faaaaaaaaaaaaaaaaaaaaaaaaaaaaaf..........ff..........f333333333333333ff555555555555f33333333f222222222222222222222222f33333333333333333333
    aaaaaf555ffaaaaaaaaff5faaaaaaaaaaaaaaaaaaaaaaaaaaaaaf..........ff..........f33333333333333ff5555555555555ff3333333f222222222222222222222222f33333333333333333333
    aaaaff555faaaaaaaaaaf5faaaaaaaaaaaaaaaaaaaaaaaaaaaaf...........ff...........f333333333333ff555ffffffff5555f3333333f222222222222222222222222f33333333333333333333
    aaaaf5555faaaaaaaaaaf5faaaaaaaaaaaaaaaaaaaaaaaaaaaaf...........ff...........f333333333333f5555f333333ff555f3333333f222222222222222222222222f33333333333333333333
    aaaaf5555faaaaaaaaaaf5faaaaaaaaaaaaaaaaaaaaaaaaaaaaffff........ff........ffff333333333333f5555f3333333ff55f3333333ffffffffffffffffffffffffff33333333333333333333
    afffffffffffffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafffff...ff...fffff3333333333333333f555ff33333333ff5f33333333333333333333333333333333333333333333333333333
    af222222222222222222222ffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaff...ffff3fff...ff333333333333333ff555f3333333333f5f33333333333333333333333333333333333333333333333333333
    af22222222222222222222222ffaaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaf333f....f333333333333333f5555f3333333333f5f33333333333333333333333333333333333333333333333333333
    af22222222222222222222222faaaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaf333f....f333333333333333f5555f3333333333f5f33333333333333333333333333333333333333333333333333333
    af22222222222222222222222faaaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaf333f....f333333333333fffffffffffffffffffffff3333333333333333333333333333333333333333333333333333
    af22228888888888888888222faaaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaf333f....f333333333333f222222222222222222222ffff3333333333333333333333333333333333333333333333333
    af22228888888888888888222faaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaaf3333f....f33333333333f22222222222222222222222ff3333333333333333333333333333333333333333333333333
    af22228888888888888888222faaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaaf3333f....f33333333333f22222222222222222222222f33333333333333333333333333333333333333333333333333
    af22228888888888888888222faaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaaf3333f....f33333333333f22222222222222222222222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222faaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaaf3333f....f33333333333f22221111111111111111222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222faaaaaaaaaaaaaaaaaaaaaaaaaaaaf....faaaf3333f....f33333333333f22221111111111111111222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222faaaaaaaaaaaaaaaaaaaaaaaaaaaaf...faaaaf3333ff...f33333333333f22221111111111111111222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222faaaaaaaaaaaaaaaaaaaaaaaaaaaffff.ffaaaf333ff.ffff33333333333f22221111111111111111222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222faaaaaaaaaaaaaaaaaaaaaaaaaaaf...fffaaaf333fff...f33333333333f22222222221111122222222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222faaaaaaaaaaaaaaaaaaaaaaaaaaff.....faaaf333f.....ff3333333333f22222222221111122222222f33333333333333333333333333333333333333333333333333
    af22222222228888822222222ffaaaaaaaaaaaaaaaaaaaaaaaaffff....faaaf333f....ffff333333333f22222222221111122222222f33333333333333333333333333333333333333333333333333
    af222222222288888222222222faaaaaaaaaaaaaaaaaaaaaaaff...ff..faaaf333f..ff...ff33333333f22222222221111122222222f33333333333333333333333333333333333333333333333333
    af222222222288888222222222faaaaaaaaaaaaaaaaaaaaaaffff..fffffaaaf333fffff..ffff3333333f22222222221111122222222f33333333333333333333333333333333333333333333333333
    af222222222222222222222222faaaaaaaaaaaaaaaaaaaaaff..ffff...faaaf333f...ffff..ff333333f22222222221111122222222f33333333333333333333333333333333333333333333333333
    af222222222222222222222222faaaaaaaaaaaaaaaaaaaaff..........faaaf333f..........ff33333f22222222221111122222222ff3333333333333333333333333333333333333333333333333
    af222222222222222222222222faaaaaaaaaaaaaaaaaaaffffffffffffffaaaf333ffffffffffffff3333f222222222211111222222222f3333333333333333333333333333333333333333333333333
    af222222222222222222222222faaaaaaaaaaaaaaaaaaaf..........fffaaaf333fff..........f3333f222222222211111222222222f3333333333333333333333333333333333333333333333333
    af222222222222222222222222faaaaaaaaaaaaaaaaaaaffffffffffffafaaaf333f3ffffffffffff3333f222222222222222222222222f3333333333333333333333333333333333333333333333333
    affffffffffffffffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaf333333333333333333333f222222222222222222222222f3333333333333333333333333333333333333333333333333
    `)
estado = "seleccion"
nivelActual = 1
capacidadPiezas = 3
velocidad = 90
puntosReparacion = 100
costoReparacion = 3
if (TestMode) {
	
} else {
    pause(500)
    presentarHistoria()
    color.startFade(color.originalPalette, color.Black)
    color.pauseUntilFadeDone()
    color.startFade(color.Black, color.originalPalette)
}
menuPersonajes = miniMenu.createMenu(
miniMenu.createMenuItem("Ale: mas velocidad", assets.image`ale0`),
miniMenu.createMenuItem("Cami: ahorra 1 pieza", assets.image`cami0`),
miniMenu.createMenuItem("Cris: +25 al reparar", assets.image`cris`),
miniMenu.createMenuItem("Nico: carga 1 mas", assets.image`nico0`)
)
function_estilo_menu()
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
    sprites.destroy(myTextSprite2)
})
