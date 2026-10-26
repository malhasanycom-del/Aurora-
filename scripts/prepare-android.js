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
const htmlPath = path.join(root, 'www', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('id="themeSelect"')) {
  html = html.replace(' <div class="settings-card"><strong>الخصوصية والتخزين</strong>', ' <div class="settings-card"><strong>تغيير الواجهة</strong><div class="formrow"><label>المظهر</label><select class="field" id="themeSelect"><option value="aurora">Aurora</option><option value="midnight">Midnight</option><option value="light">فاتح</option><option value="emerald">Emerald</option></select></div></div>\\n <div class="settings-card"><strong>الخصوصية والتخزين</strong>');
}
if (!html.includes('body[data-theme="midnight"]')) { html = html.replace('*{box-sizing:border-box}body{', '*{box-sizing:border-box}body[data-theme="midnight"]{--bg:#050b16;--cyan:#80bfff;--violet:#658dff;--pink:#7ea7ff}body[data-theme="light"]{--bg:#f2f5fb;--text:#172033;--muted:#59677c;--cyan:#1264b5;--violet:#6452cc;--pink:#bb438f}body[data-theme="light"] .stat,body[data-theme="light"] .channel,body[data-theme="light"] .settings-card{background:#fff;color:#172033}body[data-theme="light"] .field,body[data-theme="light"] .search{background:#fff;color:#172033}body[data-theme="emerald"]{--bg:#06140f;--cyan:#66f0b4;--violet:#66cfa5;--pink:#b4f17a}body{'); }
if (!html.includes('function applyAuroraTheme')) {
  html = html.replace("render();selectType('m3u');", "const themeSelect=document.getElementById('themeSelect');function applyAuroraTheme(theme){const t=['aurora','midnight','light','emerald'].includes(theme)?theme:'aurora';document.body.dataset.theme=t;localStorage.setItem('aurora-theme',t);if(themeSelect)themeSelect.value=t;}if(themeSelect)themeSelect.onchange=()=>{applyAuroraTheme(themeSelect.value);toast('تم تغيير الواجهة')};applyAuroraTheme(localStorage.getItem('aurora-theme')||'aurora');render();selectType('m3u');");
}
fs.writeFileSync(htmlPath, html);
if (!html.includes('window.AuroraMedia3.play({url:url,title:c.name})')) { console.error('Media3 playback hook was not inserted.'); process.exit(1); }\nconsole.log('Prepared selectable UI themes and native Media3 playback.'); 
console.log('Bundled local HLS library and native Android HTTP bridge.');
