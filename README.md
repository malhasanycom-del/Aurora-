# Aurora IPTV

A fresh Android IPTV player project built with Capacitor. Supports user-provided M3U/M3U8 playlists, Xtream Codes portals, EPG XMLTV, favorites, search, recently played, parental PIN, playback controls and Android TV-friendly focus states.

## Build locally

- Node.js 22+
- Java 21
- Android SDK platform 36 and build tools

```sh
npm install
npm run validate
cp node_modules/hls.js/dist/hls.min.js www/vendor/hls.min.js
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

The GitHub Actions workflow builds a debug APK and uploads it as an artifact. The app intentionally does not inflate the APK with meaningless padding. Final size depends on Android build output and must be measured from the artifact.

## Privacy

Playlist credentials and preferences are stored locally on the device. Do not add playlists you do not trust. Some IPTV providers block requests from apps or require portal-specific Stalker authorization; support depends on provider configuration and CORS/network rules.
