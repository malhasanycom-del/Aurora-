const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'www', 'index.html'), 'utf8');
const patch = fs.readFileSync(path.join(__dirname, 'patch-android.js'), 'utf8');
const prepare = fs.readFileSync(path.join(__dirname, 'prepare-android.js'), 'utf8');
const required = ['id="app"', 'id="player"', 'parseM3U', 'Xtream Codes', 'Stalker Portal', 'EPG', 'favorites', 'parental', 'sleepBtn', 'vendor/hls.min.js', 'vendor/native-http.js', 'httpRequest', 'parseM3UFile', "$('#heroAdd').onclick=e=>"];
const missing = required.filter(s => !html.toLowerCase().includes(s.toLowerCase()));
const nativeFiles = [
  'native/android/tv/aurora/player/Media3PlayerActivity.java',
  'native/android/tv/aurora/player/AuroraMedia3Plugin.java',
  'scripts/native-http-entry.js'
];
for (const file of nativeFiles) if (!fs.existsSync(path.join(root, file))) missing.push(file);
if (!patch.includes('media3-exoplayer-hls:1.11.1')) missing.push('Media3 1.11.1 HLS dependency');
if (!patch.includes('MainActivity') || !patch.includes('android:screenOrientation="landscape"')) missing.push('forced landscape app orientation');
if (!patch.includes('network_security_config.xml') || !patch.includes('zakm3u.com')) missing.push('scoped HTTP network policy');
if (!prepare.includes('applyAuroraTheme') || !prepare.includes('AuroraMedia3.play')) missing.push('theme / Media3 integration');
if (missing.length) { console.error('Validation failed:', missing.join(', ')); process.exit(1); }
if (!html.includes('</html>')) { console.error('HTML document is incomplete'); process.exit(1); }
console.log('Aurora static validation passed: IPTV UI, native Media3, scoped HTTP config, and theme packaging markers found.');
