const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'node_modules', 'hls.js', 'dist', 'hls.min.js');
const destDir = path.join(__dirname, '..', 'www', 'vendor');
const dest = path.join(destDir, 'hls.min.js');
if (!fs.existsSync(src)) { console.error('hls.js is missing. Run npm install first.'); process.exit(1); }
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Bundled local HLS playback library.');
