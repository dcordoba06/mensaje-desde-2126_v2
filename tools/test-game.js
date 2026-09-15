// Tests for game rules. Arcade itself is replaced by a small in-memory world.
const assert = require('node:assert/strict');
const fs = require('fs');
const vm = require('vm');
require('pxt-core/built/pxt.js');
const ts = global.ts;
const source = fs.readFileSync('main.ts', 'utf8');
const maps = JSON.parse(fs.readFileSync('tilemap.g.jres', 'utf8'));
const code = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2017}}).outputText;
function game(character) {
    let all=[], overlaps={}, buttons={}, menu, zero, time=2000, score=0, lives=3, current, answer=true;
    const make=(image,kind)=>({image,kind,x:0,y:0,destroyed:false,z:0,setPosition(x,y){this.x=x;this.y=y;},setKind(k){this.kind=k;},setFlag(){},setImage(i){this.image=i;},sayText(t){this.bubble=t;}});
    const create=(image,kind)=>{const s=make(image,kind);all.push(s);return s;};
    const destroy=s=>{s.destroyed=true;};
    const button=n=>({onEvent:(e,fn)=>buttons[n]=fn});
    let nextKind=10;
    const ctx={console,Math,SpriteKind:{Player:0,create:()=>nextKind++},SpriteFlag:{RelativeToCamera:1},DialogLayout:{Full:1,Bottom:2},ControllerButtonEvent:{Pressed:1},
        assets:{image: s=>s[0],tile:s=>s[0]},tilemap:s=>s[0],
        sprites:{create,destroy,destroyAllSpritesOfKind:k=>all.filter(s=>s.kind===k).forEach(destroy),onOverlap:(a,b,fn)=>overlaps[b]=fn},
        scene:{setBackgroundImage(){},setBackgroundColor(){},cameraFollowSprite(){}},
        fancyText:{create:t=>{const s=create('text',99);s.text=t;return s;},setColor(){},setText:(s,t)=>s.text=t},
        info:{setScore:v=>score=v,changeScoreBy:v=>score+=v,setLife:v=>lives=v,changeLifeBy:v=>{lives+=v;if(lives<=0)zero();},onLifeZero:fn=>zero=fn},
        controller:{A:button('A'),B:button('B'),up:button('up'),down:button('down'),left:button('left'),right:button('right'),moveSprite:(s,x,y)=>{s.vxControl=x;s.vyControl=y;}},
        game:{splash(){},showLongText(){},ask:()=>answer,runtime:()=>time},
        miniMenu:{Button:{A:1},createMenuItem:(text,image)=>({text,image}),createMenu:()=>({}),close(){},onButtonPressed:(m,b,fn)=>menu=fn},
        tiles:{setCurrentTilemap:n=>{current=maps[n];},getTileLocation:(x,y)=>({x,y}),placeOnTile:(s,l)=>s.setPosition(l.x*16+8,l.y*16+8),setTileAt(){},getTilesByType:n=>{const bytes=Buffer.from(Buffer.from(current.data,'base64').toString(),'hex'),w=bytes.readUInt16LE(1),h=bytes.readUInt16LE(3),id=current.tileset.indexOf('myTiles.'+n),out=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(bytes[5+y*w+x]===id)out.push({x,y});return out;}}
    };
    vm.createContext(ctx);vm.runInContext(code,ctx);menu('',character);
    const get=n=>vm.runInContext(n,ctx),set=(n,v)=>{ctx.testValue=v;vm.runInContext(n+' = testValue',ctx);};
    return {get,set,call:(n,...a)=>ctx[n](...a),press:n=>buttons[n](),collect:kind=>{const s=all.find(s=>!s.destroyed&&s.kind===ctx.SpriteKind[kind]);assert(s,kind+' available');overlaps[ctx.SpriteKind[kind]](get('jugador'),s);return s;},hazard:()=>overlaps[ctx.SpriteKind.Peligro](get('jugador'),{}),advance:()=>time+=1501,answer:v=>answer=v,score:()=>score,lives:()=>lives,remaining:k=>all.filter(s=>!s.destroyed&&s.kind===ctx.SpriteKind[k]).length};
}
for (const [index,name,capacity,speed,discount,points] of [[0,'Ale',3,110,0,100],[1,'Cami',3,90,1,100],[2,'Cris',3,90,0,125],[3,'Nico',4,90,0,100]]) {
    const g=game(index);
    assert.equal(g.get('personajeSeleccionado'),name);assert.equal(g.get('capacidadPiezas'),capacity);assert.equal(g.get('velocidad'),speed);assert.equal(g.get('descuentoPiezas'),discount);assert.equal(g.get('puntosReparacion'),points);
    for(let i=0;i<capacity;i++)g.collect('Pieza');const count=g.remaining('Pieza'),score=g.score();g.collect('Pieza');assert.equal(g.get('piezas'),capacity);assert.equal(g.remaining('Pieza'),count);assert.equal(g.score(),score);
    g.collect('Moneda');assert.equal(g.get('dinero'),10);assert.equal(g.score(),score+5);
    g.hazard();assert.equal(g.lives(),3);g.advance();g.hazard();assert.equal(g.lives(),2);g.hazard();assert.equal(g.lives(),2);g.advance();g.hazard();g.advance();g.hazard();assert.equal(g.lives(),3);assert.equal(g.get('jugador').x,104);assert.equal(g.get('piezas'),capacity);assert.equal(g.get('dinero'),10);assert.equal(g.remaining('Pieza'),count);
    g.call('iniciarReparacion');assert.equal(g.get('estado'),'reparacion');g.press('A');g.press('left');assert.equal(g.get('pasoReparacion'),0);assert.equal(g.get('piezas'),capacity);g.press('down');assert.equal(g.get('estado'),'exploracion');
    g.call('iniciarReparacion');for(const key of ['A','B','A','up'])g.press(key);assert.equal(g.get('nivelActual'),2);assert.equal(g.get('piezas'),capacity-(3-discount));assert.equal(g.get('dinero'),30);assert.equal(g.score(),score+5+points);assert.equal(g.get('personajeSeleccionado'),name);assert.equal(g.lives(),3);assert.equal(g.remaining('Peligro'),0);g.press('up');assert.equal(g.score(),score+5+points);
}
{
 const g=game(1);g.call('iniciarReparacion');assert.equal(g.get('estado'),'exploracion');g.call('mejorarMochila');assert.equal(g.get('capacidadPiezas'),3);g.set('dinero',100);g.answer(false);g.call('mejorarMochila');assert.equal(g.get('dinero'),100);g.answer(true);g.call('mejorarMochila');g.call('mejorarMochila');g.call('mejorarMochila');assert.equal(g.get('capacidadPiezas'),5);assert.equal(g.get('dinero'),60);g.call('mejorarHerramienta');g.call('mejorarHerramienta');assert.equal(g.get('dinero'),30);g.call('calcularCosto');assert.equal(g.get('costoReparacion'),1);
}
// Every resource and the repair station must be reachable from the base, without touching hazards.
{
 const map=maps.ciudadReciclaje,bytes=Buffer.from(Buffer.from(map.data,'base64').toString(),'hex'),w=bytes.readUInt16LE(1),h=bytes.readUInt16LE(3),walls=bytes.subarray(5+w*h),hazard=map.tileset.indexOf('myTiles.marcaPeligro');
 const solid=(x,y)=>{const i=y*w+x;return ((walls[i>>1]>>(4*(i%2)))&15)!==0;};
 const queue=[[6,6]],seen=new Set(['6,6']);
 for(let p=0;p<queue.length;p++){const [x,y]=queue[p];for(const [nx,ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]])if(nx>=0&&ny>=0&&nx<w&&ny<h&&!solid(nx,ny)&&bytes[5+ny*w+nx]!==hazard&&!seen.has(nx+','+ny)){seen.add(nx+','+ny);queue.push([nx,ny]);}}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(['myTiles.marcaPieza','myTiles.marcaMoneda'].includes(map.tileset[bytes[5+y*w+x]]))assert(seen.has(x+','+y),'Unreachable resource '+x+','+y);
 assert(seen.has('29,18'),'Unreachable repair station');
}
console.log('OK: four abilities, full inventory, money, damage cooldown, return to base, repair failure/cancel/success, no double reward, upgrades, reachable resources and objective.');
