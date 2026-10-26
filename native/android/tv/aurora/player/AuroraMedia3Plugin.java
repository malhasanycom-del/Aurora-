package tv.aurora.player;

import android.content.Intent;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AuroraMedia3")
public class AuroraMedia3Plugin extends Plugin {
  @PluginMethod public void play(PluginCall call) {
    String url = call.getString("url");
    String title = call.getString("title", "Aurora IPTV");
    if (url == null || !(url.startsWith("http://") || url.startsWith("https://"))) {
      call.reject("رابط البث غير صالح");
      return;
    }
    Intent intent = new Intent(getContext(), Media3PlayerActivity.class);
    intent.putExtra("url", url);
    intent.putExtra("title", title);
    getContext().startActivity(intent);
    call.resolve();
  }
}
