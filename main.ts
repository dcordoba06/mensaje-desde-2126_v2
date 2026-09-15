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
    tiles.setCurrentTilemap(tilemap`ciudadNaturaleza`)
    ponerCartel("PARQUE: TALLER", 8, 23)
}
// BOTÓN B: fuera del minijuego vuelve a mostrar la misión.
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("B")
    } else if (estado == "exploracion") {
        consultarMensaje()
    }
})
function continuarExplorando () {
    estado = "exploracion"
    controller.moveSprite(jugador, velocidad, velocidad)
    actualizarContador()
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
            if (Created) {
            	
            } else {
                myTextSprite = fancyText.create("\"A\" para interactuar")
                Text_sprite_2 = fancyText.create("\"B\" para misión")
                Created = true
                fancyText.setFont(Text_sprite_2, fancyText.geometric_sans_6)
                fancyText.setColor(Text_sprite_2, fancyText.twoToneColor(15, 15))
                myTextSprite.setPosition(72, 18)
                fancyText.setColor(myTextSprite, fancyText.twoToneColor(15, 15))
                fancyText.setFont(myTextSprite, fancyText.geometric_sans_6)
            }
            myTextSprite.setFlag(SpriteFlag.RelativeToCamera, true)
            Text_sprite_2.setFlag(SpriteFlag.RelativeToCamera, true)
            myTextSprite.setFlag(SpriteFlag.Invisible, false)
            fancyText.animateAtSpeed(myTextSprite, fancyText.TextSpeed.Fast, fancyText.AnimationPlayMode.UntilDone)
            pause(2000)
            myTextSprite.setFlag(SpriteFlag.Invisible, true)
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
/**
 * 6. TU TALLER
 * 
 * Aquí continúan ustedes: niveles 2, 3 y 4.
 * 
 * Cada función tiene su propio mapa.
 * 
 * Clic derecho → Expandir bloque para ver su contenido.
 */
// POR CONSTRUIR: diseña la misión del agua y coloca sus piezas y dispositivos.
function cargarNivel2 () {
    tiles.setCurrentTilemap(tilemap`ciudadAgua`)
    ponerCartel("AGUA: TALLER", 29, 21)
}
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
info.onLifeZero(function () {
    volverALaBase()
    jugador.sayText("A salvo! Conservas tus recursos.", 2000, false)
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
// CARTELES: usa esta función con un texto, una columna y una fila del mapa.
function ponerCartel (texto: string, columna: number, fila: number) {
    cartel = fancyText.create(texto)
    cartel.setKind(SpriteKind.Cartel)
    fancyText.setColor(cartel, 1)
    tiles.placeOnTile(cartel, tiles.getTileLocation(columna, fila))
}
// MARCADORES: gris = pieza, amarillo = moneda, verde = peligro. Se vuelven acera.
function colocarRecursosYPeligros () {
    for (let lugar of tiles.getTilesByType(assets.tile`marcaPieza0`)) {
        objeto = sprites.create(assets.image`pieza0`, SpriteKind.Pieza)
        tiles.placeOnTile(objeto, lugar)
        tiles.setTileAt(lugar, assets.tile`acera0`)
    }
    for (let lugar2 of tiles.getTilesByType(assets.tile`marcaMoneda0`)) {
        objeto = sprites.create(assets.image`moneda0`, SpriteKind.Moneda)
        tiles.placeOnTile(objeto, lugar2)
        tiles.setTileAt(lugar2, assets.tile`acera0`)
    }
    for (let lugar3 of tiles.getTilesByType(assets.tile`marcaPeligro0`)) {
        objeto = sprites.create(assets.image`peligro0`, SpriteKind.Peligro)
        tiles.placeOnTile(objeto, lugar3)
        tiles.setTileAt(lugar3, assets.tile`acera0`)
    }
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
// POR CONSTRUIR: añade humo y dos componentes antes de la reparación final.
function cargarNivel3 () {
    tiles.setCurrentTilemap(tilemap`ciudadAire`)
    ponerCartel("AIRE: TALLER", 29, 21)
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("IZQUIERDA")
    }
})
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.Moneda, function (sprite, moneda) {
    if (estado == "exploracion") {
        sprites.destroy(moneda)
        dinero += 10
        info.changeScoreBy(5)
        actualizarContador()
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("DERECHA")
    }
})
// PREMIO Y PISTA: aquí pueden escribir cómo cambió 2126 y la primera pista.
function completarMision () {
    estado = "mensaje"
    misionCompletada = true
    piezas += 0 - costoReparacion
    dinero += 20
    info.changeScoreBy(puntosReparacion)
    dispositivo.setImage(assets.image`recolectorListo0`)
    actualizarContador()
    game.showLongText("2126: funciona! El centro de reciclaje vuelve a recuperar materiales. Reutilizarlos ayuda a reducir residuos y la necesidad de fabricar materiales nuevos. Gracias!", DialogLayout.Full)
    game.showLongText("Primera pista: detras del recolector aparece el mismo simbolo que tiene la maquina. Quien lo puso ahi?", DialogLayout.Full)
    game.showLongText("Mision 1 completa: +20 monedas y +" + puntosReparacion + " puntos. Ahora visitaras el mapa de trabajo del nivel 2. Las siguientes misiones quedan para que ustedes las creen.", DialogLayout.Full)
    nivelActual += 1
    cargarNivel()
}
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
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        pasoReparacion = 0
        continuarExplorando()
    }
})
// NIVEL 1: este es el ejemplo jugable. Mueve los marcadores de colores en el mapa.
function cargarNivel1 () {
    tiles.setCurrentTilemap(tilemap`ciudadReciclaje`)
    colocarRecursosYPeligros()
    dispositivo = sprites.create(assets.image`recolector0`, SpriteKind.Equipo)
    tiles.placeOnTile(dispositivo, tiles.getTileLocation(29, 18))
    ponerCartel("ESCUELA", 29, 6)
    ponerCartel("RECICLAJE", 30, 19)
    ponerCartel("PARQUE", 8, 23)
}
function function_estilo_menu () {
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Margin, 3)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, -1)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, -5)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 4)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    miniMenu.setStyleProperty(menuPersonajes, miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Border, 1)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (estado == "reparacion") {
        comprobarBoton("ARRIBA")
    }
})
let objeto: Sprite = null
let cartel: fancyText.TextSprite = null
let contador: fancyText.TextSprite = null
let fondoContador: Sprite = null
let descuentoPiezas = 0
let piezas = 0
let protegidoHasta = 0
let Text_sprite_2: fancyText.TextSprite = null
let myTextSprite: fancyText.TextSprite = null
let Created = false
let misionCompletada = false
let dispositivo: Sprite = null
let herramienta: Sprite = null
let mochila: Sprite = null
let botiquin: Sprite = null
let maquina: Sprite = null
let pasoReparacion = 0
let nivelHerramienta = 0
let dinero = 0
let jugador: Sprite = null
let personajeSeleccionado = ""
let menuPersonajes: Sprite = null
let costoReparacion = 0
let puntosReparacion = 0
let velocidad = 0
let capacidadPiezas = 0
let nivelActual = 0
let estado = ""
estado = "seleccion"
nivelActual = 1
capacidadPiezas = 3
velocidad = 90
puntosReparacion = 100
costoReparacion = 3
let myTextSprite2 = fancyText.create("arcadeCAN")
fancyText.setColor(myTextSprite2, 8)
fancyText.setFont(myTextSprite2, fancyText.bold_sans_7)
myTextSprite2.setPosition(121, 117)
let TestMode = false
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
