import { Capacitor, CapacitorHttp } from '@capacitor/core';
window.AuroraNativeHttp = { isNative: () => Capacitor.isNativePlatform(), request: (options) => CapacitorHttp.request(options) };
