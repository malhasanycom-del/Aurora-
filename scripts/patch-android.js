const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const manifest = path.join(root, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const xmlDir = path.join(root, 'android', 'app', 'src', 'main', 'res', 'xml');
if (!fs.existsSync(manifest)) { console.error('AndroidManifest.xml not found.'); process.exit(1); }
fs.mkdirSync(xmlDir, { recursive: true });
const config = path.join(xmlDir, 'network_security_config.xml');
const configText = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<network-security-config>',
  '    <base-config cleartextTrafficPermitted="false" />',
  '    <domain-config cleartextTrafficPermitted="true">',
  '        <domain includeSubdomains="true">zakm3u.com</domain>',
  '    </domain-config>',
  '</network-security-config>',
  ''
].join('\n');
fs.writeFileSync(config, configText);
let xml = fs.readFileSync(manifest, 'utf8');
if (!xml.includes('android.permission.INTERNET')) {
  xml = xml.replace(/<application\b/, '  <uses-permission android:name="android.permission.INTERNET" />\n    <application');
}
xml = xml.replace(/<application\b([^>]*)>/, (tag, attrs) => {
  let updated = attrs;
  if (/android:networkSecurityConfig\s*=/.test(updated)) {
    updated = updated.replace(/android:networkSecurityConfig\s*=\s*["'][^"']*["']/, 'android:networkSecurityConfig="@xml/network_security_config"');
  } else {
    updated += ' android:networkSecurityConfig="@xml/network_security_config"';
  }
  if (/android:usesCleartextTraffic\s*=/.test(updated)) {
    updated = updated.replace(/android:usesCleartextTraffic\s*=\s*["'][^"']*["']/, 'android:usesCleartextTraffic="true"');
  } else {
    updated += ' android:usesCleartextTraffic="true"';
  }
  return '<application' + updated + '>';
});
fs.writeFileSync(manifest, xml);
if (!xml.includes('android:networkSecurityConfig="@xml/network_security_config"') || !xml.includes('android.permission.INTERNET')) {
  console.error('Android network configuration validation failed.');
  process.exit(1);
}
console.log('Configured INTERNET permission and HTTP access for zakm3u.com only.');
