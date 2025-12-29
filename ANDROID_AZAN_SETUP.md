# Android Azan & Azkaar Background Service Setup

For background azan audio and azkaar notifications to work when the app is closed, you need to add native Android code.

## 1. Add Azan Audio File

Place your azan audio file at:
```
android/app/src/main/res/raw/azan.mp3
```

## 2. Create AzanService.kt

Create file: `android/app/src/main/java/app/lovable/fbbd097753d649a0b31453502bf2dd53/AzanService.kt`

```kotlin
package app.lovable.fbbd097753d649a0b31453502bf2dd53

import android.app.*
import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class AzanService : Service() {
    private var mediaPlayer: MediaPlayer? = null
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val title = intent?.getStringExtra("title") ?: "Prayer Time"
        val body = intent?.getStringExtra("body") ?: "It's time for prayer"
        val playAudio = intent?.getBooleanExtra("playAudio", true) ?: true
        
        createNotificationChannel()
        val notification = createNotification(title, body)
        startForeground(1, notification)
        
        if (playAudio) {
            playAzan()
        }
        
        return START_NOT_STICKY
    }
    
    private fun playAzan() {
        try {
            mediaPlayer = MediaPlayer.create(this, R.raw.azan)
            mediaPlayer?.setOnCompletionListener {
                stopSelf()
            }
            mediaPlayer?.start()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "azan_channel",
                "Azan Notifications",
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(title: String, body: String): Notification {
        return NotificationCompat.Builder(this, "azan_channel")
            .setContentTitle(title)
            .setContentText(body)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
    }
    
    override fun onDestroy() {
        mediaPlayer?.release()
        super.onDestroy()
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
}
```

## 3. Register Service in AndroidManifest.xml

Add inside `<application>` tag:
```xml
<service android:name=".AzanService" android:foregroundServiceType="mediaPlayback" />
```

Add permissions at top:
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

## 4. Build and Run

```bash
git pull
npx cap sync android
```

Then rebuild in Android Studio.
