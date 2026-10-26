const fs = require('fs');
const path = require('path');
const manifest = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (!fs.existsSync(manifest)) { console.error('AndroidManifest.xml not found.'); process.exit(1); }
let xml = fs.readFileSync(manifest, 'utf8');
if (!xml.includes('android.permission.INTERNET')) xml = xml.replace(/<application\b/, '  <uses-permission android:name="android.permission.INTERNET" />\n    <application');
xml = xml.replace(/<application\b([^>]*)>/, (tag, attrs) => {
  if (/android:usesCleartextTraffic\s*=/.test(attrs)) return tag.replace(/android:usesCleartextTraffic\s*=\s*["'][^"']*["']/, 'android:usesCleartextTraffic="true"');
  return '<application' + attrs + ' android:usesCleartextTraffic="true">';
});
fs.writeFileSync(manifest, xml);
console.log('Enabled Android network permission and HTTP sources.');
