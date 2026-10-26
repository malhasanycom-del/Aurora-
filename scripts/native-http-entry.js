import { Capacitor, CapacitorHttp, registerPlugin } from '@capacitor/core';
window.AuroraNativeHttp = {
  isNative: () => Capacitor.isNativePlatform(),
  request: (options) => CapacitorHttp.request(options)
};
window.AuroraMedia3 = registerPlugin('AuroraMedia3');
