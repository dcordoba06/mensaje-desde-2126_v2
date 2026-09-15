// Local preview: no source or game assets are sent to a cloud service.
const http = require('http');
const fs = require('fs');
const path = require('path');
const paths = {
    '/': path.join(__dirname, 'preview.html'),
    '/proyecto.mkcd': path.join(__dirname, '../built/Mensaje-desde-2126.mkcd'),
    '/runtime.js': require.resolve('pxt-core/built/pxtsim.js'),
    '/arcade.js': require.resolve('pxt-arcade/built/sim.js'),
    '/game.js': path.join(__dirname, '../assets/js/binary.js')
};
http.createServer((req,res)=>{
    const file = paths[req.url];
    if (!file) {res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.mkcd')?'application/octet-stream':'text/javascript; charset=utf-8');
    fs.createReadStream(file).pipe(res);
}).listen(8126,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8126'));
