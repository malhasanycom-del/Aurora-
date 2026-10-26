const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'www', 'index.html'), 'utf8');
const required = ['id="app"', 'id="player"', 'parseM3U', 'Xtream Codes', 'Stalker Portal', 'EPG', 'favorites', 'parental', 'sleepBtn', 'vendor/hls.min.js', 'vendor/native-http.js', 'httpRequest'];
const missing = required.filter(s => !html.toLowerCase().includes(s.toLowerCase()));
if (missing.length) { console.error('Validation failed; missing expected feature markers:', missing.join(', ')); process.exit(1); }
if (!html.includes('</html>')) { console.error('HTML document is incomplete'); process.exit(1); }
console.log('Aurora source validation passed; required UI and feature markers are present.');
