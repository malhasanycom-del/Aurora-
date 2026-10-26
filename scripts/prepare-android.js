const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const root = path.join(__dirname, '..');
const src = path.join(root, 'node_modules', 'hls.js', 'dist', 'hls.min.js');
const destDir = path.join(root, 'www', 'vendor');
if (!fs.existsSync(src)) { console.error('hls.js is missing. Run npm install first.'); process.exit(1); }
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, path.join(destDir, 'hls.min.js'));
esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'native-http-entry.js')],
  bundle: true, platform: 'browser', format: 'iife', target: ['es2020'],
  outfile: path.join(destDir, 'native-http.js'), logLevel: 'warning'
});
console.log('Bundled local HLS playback and native Android HTTP bridge.');
