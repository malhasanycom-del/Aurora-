const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const app = path.join(root, 'android', 'app');
const main = path.join(app, 'src', 'main');
const manifest = path.join(main, 'AndroidManifest.xml');
const gradle = path.join(app, 'build.gradle');
const javaDir = path.join(main, 'java', 'tv', 'aurora', 'player');
const xmlDir = path.join(main, 'res', 'xml');
if (!fs.existsSync(manifest) || !fs.existsSync(gradle)) throw new Error('Generated Android files missing');
fs.mkdirSync(javaDir, { recursive: true });
fs.mkdirSync(xmlDir, { recursive: true });
fs.copyFileSync(path.join(root, 'native/android/tv/aurora/player/Media3PlayerActivity.java'), path.join(javaDir, 'Media3PlayerActivity.java'));
fs.copyFileSync(path.join(root, 'native/android/tv/aurora/player/AuroraMedia3Plugin.java'), path.join(javaDir, 'AuroraMedia3Plugin.java'));
fs.writeFileSync(path.join(xmlDir, 'network_security_config.xml'), [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<network-security-config>',
  '  <base-config cleartextTrafficPermitted="false" />',
  '  <domain-config cleartextTrafficPermitted="true">',
  '    <domain includeSubdomains="true">zakm3u.com</domain>',
  '  </domain-config>',
  '</network-security-config>'
].join('\n'));
let m = fs.readFileSync(manifest, 'utf8');
if (!m.includes('android.permission.INTERNET')) m = m.replace(/<application\b/, '  <uses-permission android:name="android.permission.INTERNET" />\n    <application');
m = m.replace(/<application\b([^>]*)>/, (tag, attrs) => {
 let a = attrs;
 if (/android:networkSecurityConfig\s*=/.test(a)) a = a.replace(/android:networkSecurityConfig\s*=\s*["'][^"']*["']/, 'android:networkSecurityConfig="@xml/network_security_config"');
 else a += ' android:networkSecurityConfig="@xml/network_security_config"';
 return '<application' + a + '>';
});
if (!m.includes('Media3PlayerActivity')) m = m.replace('</application>', '    <activity android:name=".Media3PlayerActivity" android:configChanges="keyboard|keyboardHidden|orientation|screenSize|screenLayout|smallestScreenSize" android:exported="false" android:screenOrientation="landscape" />\n</application>');
if (!m.includes('android.software.leanback')) m = m.replace('<application', '    <uses-feature android:name="android.software.leanback" android:required="false" />\n    <application');
if (!m.includes('android.intent.category.LEANBACK_LAUNCHER')) m = m.replace('<category android:name="android.intent.category.LAUNCHER" />', '<category android:name="android.intent.category.LAUNCHER" />\n                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />');
fs.writeFileSync(manifest, m);
let g = fs.readFileSync(gradle, 'utf8');
if (!g.includes('androidx.media3:media3-exoplayer:1.11.1')) g = g.replace(/dependencies\s*\{/, 'dependencies {\n    implementation "androidx.media3:media3-exoplayer:1.11.1"\n    implementation "androidx.media3:media3-exoplayer-hls:1.11.1"\n    implementation "androidx.media3:media3-ui:1.11.1"');
fs.writeFileSync(gradle, g);
const mainActivity = path.join(javaDir, 'MainActivity.java');
if (!fs.existsSync(mainActivity)) throw new Error('MainActivity.java missing');
let mainText = fs.readFileSync(mainActivity, 'utf8');
if (!mainText.includes('AuroraMedia3Plugin.class')) {
 mainText = mainText.replace('import com.getcapacitor.BridgeActivity;', 'import com.getcapacitor.BridgeActivity;\nimport android.os.Bundle;');
 mainText = mainText.replace('public class MainActivity extends BridgeActivity {', 'public class MainActivity extends BridgeActivity {\n @Override public void onCreate(Bundle savedInstanceState) { registerPlugin(AuroraMedia3Plugin.class); super.onCreate(savedInstanceState); }');
 fs.writeFileSync(mainActivity, mainText);
}
if (!g.includes('media3-exoplayer-hls:1.11.1') || !m.includes('android:networkSecurityConfig="@xml/network_security_config"')) throw new Error('Media3/network config validation failed');
console.log('Configured scoped HTTP access and native Media3 1.11.1 HLS playback.');
