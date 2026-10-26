package tv.aurora.player;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.graphics.Color;
import androidx.media3.common.MediaItem;
import androidx.media3.common.PlaybackException;
import androidx.media3.common.Player;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;

public class Media3PlayerActivity extends Activity {
  private ExoPlayer player;
  @Override public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    FrameLayout root = new FrameLayout(this);
    root.setBackgroundColor(Color.BLACK);
    PlayerView view = new PlayerView(this);
    view.setUseController(true);
    root.addView(view, new FrameLayout.LayoutParams(-1, -1));
    TextView status = new TextView(this);
    status.setTextColor(Color.WHITE);
    status.setTextSize(16);
    status.setPadding(24, 24, 24, 24);
    status.setText(getIntent().getStringExtra("title") == null ? "Aurora IPTV" : getIntent().getStringExtra("title"));
    root.addView(status, new FrameLayout.LayoutParams(-2, -2, android.view.Gravity.TOP | android.view.Gravity.START));
    setContentView(root);
    player = new ExoPlayer.Builder(this).build();
    view.setPlayer(player);
    String url = getIntent().getStringExtra("url");
    if (url == null || url.isEmpty()) { status.setText("رابط البث غير صالح"); return; }
    player.addListener(new Player.Listener() {
      @Override public void onPlayerError(PlaybackException error) { status.setText("تعذر تشغيل البث: " + error.getErrorCodeName()); }
      @Override public void onPlaybackStateChanged(int state) { if (state == Player.STATE_READY) status.setText(""); }
    });
    player.setMediaItem(MediaItem.fromUri(url));
    player.prepare();
    player.play();
  }
  @Override protected void onStop() { super.onStop(); if (player != null) player.pause(); }
  @Override protected void onDestroy() { if (player != null) { player.release(); player = null; } super.onDestroy(); }
}
