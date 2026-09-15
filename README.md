# Mensaje desde 2126

Una aventura en MakeCode Arcade: en 2026, Nico, Cami, Ale y Cris reciben mensajes de sus nietos y nietas desde 2126. Reparar sistemas de la ciudad ayuda a mejorar su futuro.

**Estado del proyecto:** la primera misión es jugable. Los niveles 2, 3 y 4 son mapas de trabajo que los estudiantes deben desarrollar. No contienen todavía sus misiones, minijuegos adicionales ni el desenlace de la máquina.

## Abrir en MakeCode Arcade

1. Abre https://arcade.makecode.com/.
2. Elige **Importar → Importar URL**.
3. Pega `https://github.com/dcordoba06/mensaje-desde-2126_v2`.
4. Abre **Bloques**.

La importación desde GitHub usa la versión publicada en el repositorio. Los cambios locales deben subirse para que aparezcan allí.

También puedes importar el archivo local `built/Mensaje-desde-2126.mkcd` con **Importar → Importar archivo**. Incluye los bloques y todos los recursos sin necesidad de publicar los cambios primero. Se genera con `tools/build.js`.

## Cómo jugar

- **Flechas:** caminar por la ciudad.
- **A:** interactuar con un equipo cercano. En teclado, Z o espacio.
- **B:** consultar la misión. En teclado, X.
- **Reparación:** A → B → A → arriba. Abajo cancela.
- Un botón incorrecto reinicia la secuencia; las piezas se gastan únicamente al completarla.

En la base, usa A junto a la máquina para leer mensajes, al botiquín para recuperar corazones, a la mochila para aumentar capacidad y a la llave para mejorar la herramienta.

La primera misión consiste en recoger piezas grises y reparar el recolector situado al sureste, frente al centro de reciclaje. Las monedas amarillas permiten comprar mejoras. Los residuos verdes quitan corazones.

Al perder los tres corazones regresas a la base, recuperas la vida y conservas piezas, dinero y puntos. Los recursos recogidos no reaparecen. Hay 1,5 segundos de protección entre golpes. No hay combates ni pérdida definitiva.

## Las cuatro habilidades

| Personaje | Ventaja | Valor normal |
|---|---|---|
| Nico | Capacidad inicial de 4 piezas | 3 piezas |
| Cami | Cada reparación cuesta 1 pieza menos | 3 piezas en la misión 1 |
| Ale | Velocidad de 110 | 90 |
| Cris | 125 puntos por reparación | 100 puntos |

El personaje se mantiene al cambiar de nivel. Las ventajas se encuentran juntas en **prepararPersonaje**.

## Dónde empezar a editar los bloques

El espacio de trabajo tiene seis columnas con notas. Los grupos están plegados para que se vean sus nombres. Haz clic derecho sobre uno y elige **Expandir bloque** para ver su contenido. Los comentarios explicativos permanecen dentro de los bloques.

| Zona | Qué contiene | Primer cambio sugerido |
|---|---|---|
| 1. Inicio y personajes | Introducción, selección y habilidades | Cambiar un texto en `presentarHistoria` |
| 2. Ciudad y misión 1 | Mapa, base, objetos y carteles | Mover una pieza en el mapa |
| 3. Recursos y vida | Recolección, contadores y regreso a la base | Cambiar una recompensa |
| 4. Botones y mejoras | Interacciones, mensajes y compras | Cambiar el mensaje de la misión |
| 5. Reparar y avanzar | Costo, secuencia, recompensa y primera pista | Cambiar la pista en `completarMision` |
| 6. Tu taller | Funciones de los niveles 2–4 | Diseñar el barrio del agua |

## Dibujar el mapa

Abre el recurso **ciudadReciclaje**, o pulsa el mapa dentro de `cargarNivel1`.

- `marcaPieza`: cuadrado gris; al iniciar se convierte en una pieza sobre la acera.
- `marcaMoneda`: cuadrado amarillo; se convierte en una moneda sobre la acera.
- `marcaPeligro`: cuadrado verde; se convierte en un residuo peligroso sobre la acera.
- Usa estos marcadores en las aceras. Comprueba que no tengan una pared marcada encima.
- Las paredes y los edificios bloquean el paso. La base tiene una entrada caminable por el lado sur.
- La posición de la máquina, el botiquín y las mejoras se cambia en `colocarBase`.
- La posición del recolector se cambia en `cargarNivel1`.

El mapa `level1` conserva la base anterior como referencia. La imagen `portada` y los cuatro dibujos de personajes conservan el trabajo original.

## Recursos y mejoras

| Acción | Resultado |
|---|---|
| Recoger pieza | +1 pieza, +10 puntos; si la mochila está llena queda en el suelo |
| Recoger moneda | +10 de dinero, +5 puntos |
| Completar reparación | +20 de dinero y 100 puntos (125 para Cris) |
| Mejorar mochila | Cuesta 20; +1 de capacidad hasta un máximo de 5 |
| Mejorar herramienta | Cuesta 30; una única mejora que descuenta 1 pieza por reparación |

La herramienta y la ventaja de Cami se suman. Una reparación nunca cuesta menos de una pieza. No hace falta comprar ninguna mejora para completar la misión 1.

## Continuar con los niveles 2–4

- **cargarNivel2 / ciudadAgua:** desarrollar la misión de abastecimiento y tratamiento de agua.
- **cargarNivel3 / ciudadAire:** añadir humo y activar varios componentes.
- **cargarNivel4 / ciudadNaturaleza:** restaurar el parque y escribir el final de la máquina.

Después de completar la primera misión se abre el taller del nivel 2, claramente identificado como pendiente. Para probar directamente otro mapa, cambia `nivelActual` al inicio a 2, 3 o 4; vuelve a dejarlo en 1 para jugar desde el principio.

Las funciones de reparación actuales son el ejemplo de la misión 1. Al crear otra misión habrá que colocar sus dispositivos, adaptar el costo y la secuencia, habilitar su interacción en el botón A y agregar sus mensajes y la condición de final. No basta con dibujar un mapa nuevo.

La primera pista sobre el símbolo de la máquina es un texto provisional editable. El origen de la máquina y la revelación final quedan para los estudiantes. La duración de 4–5 minutos por nivel se ajustará después de diseñar las misiones: este cascarón no está equilibrado todavía para esa duración.

## Notas para quien ayuda con el código

Toda la lógica del juego está en `main.ts` y su versión visual sincronizada en `main.blocks`. Los archivos `images.g.ts` y `tilemap.g.ts` se generan a partir de los recursos; los estudiantes deben editar los dibujos y mapas desde MakeCode.

`tools/` contiene herramientas de desarrollo y pruebas; **no forma parte de los bloques del juego**.

Para instalar las herramientas fuera del proyecto:

```sh
npm install --prefix /tmp/mensaje-tools pxt-core@13.2.1 pxt-arcade@4.2.1
```

Desde la carpeta del proyecto:

```sh
NODE_PATH=/tmp/mensaje-tools/node_modules node -e 'require("pxt-core/built/pxt.js").mainCli(require("path").dirname(require.resolve("pxt-arcade/package.json")), ["install"])'
NODE_PATH=/tmp/mensaje-tools/node_modules node tools/build.js
NODE_PATH=/tmp/mensaje-tools/node_modules node tools/test-game.js
NODE_PATH=/tmp/mensaje-tools/node_modules node tools/preview.js
```

La vista previa está en http://127.0.0.1:8126. Usa el simulador instalado localmente. La compilación genera JavaScript, convierte la lógica a bloques y rechaza los bloques grises que no se pueden editar visualmente. Requiere también Python 3 para organizar el espacio de bloques.

Las pruebas cubren reglas de juego con un entorno simulado y accesibilidad de los recursos del mapa. La revisión visual se realiza aparte en el simulador real. La generación de archivos para consolas físicas no forma parte de esta validación local.
