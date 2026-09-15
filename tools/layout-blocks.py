"""Place editable blocks into teaching sections; keep comments from main.ts."""
from pathlib import Path
import xml.etree.ElementTree as E
path = Path('main.blocks')
root = E.fromstring(path.read_text())
uri = root.tag.split('}')[0][1:]
E.register_namespace('', uri)
q = lambda name: '{' + uri + '}' + name
sections = [
 ('1. INICIO Y PERSONAJES', 'Empieza aquí.\nAbre prepararPersonaje para cambiar las habilidades.', ['presentarHistoria', 'prepararPersonaje']),
 ('2. CIUDAD Y MISIÓN 1', 'Edita ciudadReciclaje en Recursos.\nLos marcadores colocan piezas, monedas y peligros.', ['cargarNivel', 'cargarNivel1', 'colocarBase', 'colocarRecursosYPeligros', 'ponerCartel', 'limpiarEscenario']),
 ('3. RECURSOS Y VIDA', 'Recoger, proteger y volver a la base.\nLos recursos recogidos no reaparecen al volver.', ['volverALaBase', 'continuarExplorando', 'actualizarContador']),
 ('4. BOTONES Y MEJORAS', 'A usa un equipo cercano. B consulta la misión.\nDurante la reparación, los botones tienen otra función.', ['consultarMensaje', 'estaCerca', 'mejorarMochila', 'mejorarHerramienta']),
 ('5. REPARAR Y AVANZAR', 'Secuencia: A, B, A, arriba. Abajo cancela.\nLas piezas se gastan solo al acertar.', ['calcularCosto', 'iniciarReparacion', 'comprobarBoton', 'completarMision']),
 ('6. TU TALLER', 'Aquí continúan ustedes: niveles 2, 3 y 4.\nCada función tiene su propio mapa.\nClic derecho → Expandir bloque para ver su contenido.', ['cargarNivel2', 'cargarNivel3', 'cargarNivel4'])
]
ys = [210] * len(sections)
for i,(title,note,names) in enumerate(sections):
    comment = E.Element(q('comment'), {'id': 'guia-' + str(i), 'x': str(i*650+30), 'y':'20', 'w':'570', 'h':'140'})
    comment.text=title+'\n\n'+note
    root.append(comment)
for block in list(root):
    if block.tag != q('block'): continue
    typ = block.get('type')
    mutation = block.find(q('mutation'))
    name = mutation.get('name', '') if mutation is not None else ''
    if typ == 'function_definition':
        section = next(i for i,(_,_,names) in enumerate(sections) if name in names)
    elif typ == 'pxt-on-start': section = 0
    elif typ in ['spritesoverlap', 'gamelifeevent']: section = 2
    else: section = 3
    block.set('x', str(section*650+40));block.set('y',str(ys[section]))
    # Fold groups so the first view is readable; comments remain inside the actual blocks.
    block.set('collapsed','true')
    ys[section] += 85
path.write_text(E.tostring(root, encoding='unicode')+'\n')
print('OK: six teaching sections and preserved block comments.')
