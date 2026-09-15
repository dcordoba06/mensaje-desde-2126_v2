// Developer helper: compile locally, then let MakeCode produce editable blocks.
// Run with NODE_PATH pointing to a folder containing pxt-core and pxt-arcade.
const fs = require('fs');
const path = require('path');
process.env.PXT_FORCE_LOCAL = '1';
const cli = require('pxt-core/built/pxt.js');
const targetDirectory = path.dirname(require.resolve('pxt-arcade/package.json'));
const compile = global.pxtc.compile;
const clean = text => text.split('\n').map(line => line.trimEnd()).join('\n').trimEnd() + '\n';
fs.writeFileSync('images.g.ts', clean(pxt.emitProjectImages(JSON.parse(fs.readFileSync('images.g.jres', 'utf8')))));
fs.writeFileSync('tilemap.g.ts', clean(pxt.emitTilemapsFromJRes(JSON.parse(fs.readFileSync('tilemap.g.jres', 'utf8')))));
global.pxtc.compile = function (options) {
    if (options.target.isNative) throw new Error('This helper only builds the local simulator.');
    options.ast = true;
    const result = compile(options);
    if (!result.success) {
        console.error(result.diagnostics);
        process.exit(1);
    }
    options.errorOnGreyBlocks = true;
    const blocks = pxtc.decompile(pxtc.getTSProgram(options), options, 'main.ts');
    if (!blocks.success) {
        console.error(blocks.diagnostics);
        process.exit(1);
    }
    const xml = blocks.outfiles['main.blocks'];
    if (/ts_statement|ts_expression/.test(xml)) throw new Error('Noneditable JavaScript block found.');
    fs.writeFileSync('main.blocks', xml);
    require('child_process').execFileSync('python3', [path.join(__dirname, 'layout-blocks.py')], {stdio:'inherit'});
    const version = pxt.appTarget.versions.target;
    const meta = {simUrl: `https://trg-arcade.userpxt.io/v${version}/---simulator`, cdnUrl: 'https://cdn.makecode.com', version: '0.0.0', target: 'arcade', targetVersion: version};
    fs.writeFileSync('assets/js/binary.js', clean('// meta=' + JSON.stringify(meta) + '\n' + result.outfiles['binary.js']));
    const config = JSON.parse(fs.readFileSync('pxt.json', 'utf8'));
    const files = {};
    for (const file of ['pxt.json', ...config.files, ...(config.testFiles || [])]) files[file] = fs.readFileSync(file, 'utf8');
    fs.mkdirSync('built', {recursive:true});
    fs.writeFileSync('built/Mensaje-desde-2126.mkcd', JSON.stringify({meta:{cloudId:'pxt/arcade', targetVersions:pxt.appTarget.versions, editor:'blocksprj', name:config.name}, source:JSON.stringify(files)}, null, 2));
    console.log('OK: local compilation and editable blocks; no grey JavaScript blocks.');
    process.exit(0);
};
cli.mainCli(targetDirectory, ['run']);
