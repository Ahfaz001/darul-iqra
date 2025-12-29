# Native Android Foreground Dua Service Setup

This document contains the native Android code needed to implement the persistent Dua notification feature that works even when the app is closed.

## Files to Create

After exporting to GitHub and running `npx cap add android`, you need to create these files in the `android/app/src/main/java/app/lovable/fbbd097753d649a0b31453502bf2dd53/` directory.

### 1. Create `ForegroundDuaPlugin.kt`

```kotlin
package app.lovable.fbbd097753d649a0b31453502bf2dd53

import android.content.Intent
import android.os.Build
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "ForegroundDua")
class ForegroundDuaPlugin : Plugin() {

    @PluginMethod
    fun startService(call: PluginCall) {
        val arabic = call.getString("arabic") ?: ""
        val transliteration = call.getString("transliteration") ?: ""
        val translation = call.getString("translation") ?: ""
        val intervalMs = call.getLong("intervalMs") ?: 3600000L

        val intent = Intent(context, DuaForegroundService::class.java).apply {
            action = DuaForegroundService.ACTION_START
            putExtra(DuaForegroundService.EXTRA_ARABIC, arabic)
            putExtra(DuaForegroundService.EXTRA_TRANSLITERATION, transliteration)
            putExtra(DuaForegroundService.EXTRA_TRANSLATION, translation)
            putExtra(DuaForegroundService.EXTRA_INTERVAL, intervalMs)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }

        call.resolve()
    }

    @PluginMethod
    fun stopService(call: PluginCall) {
        val intent = Intent(context, DuaForegroundService::class.java).apply {
            action = DuaForegroundService.ACTION_STOP
        }
        context.stopService(intent)
        call.resolve()
    }

    @PluginMethod
    fun updateNotification(call: PluginCall) {
        val arabic = call.getString("arabic") ?: ""
        val transliteration = call.getString("transliteration") ?: ""
        val translation = call.getString("translation") ?: ""

        val intent = Intent(context, DuaForegroundService::class.java).apply {
            action = DuaForegroundService.ACTION_UPDATE
            putExtra(DuaForegroundService.EXTRA_ARABIC, arabic)
            putExtra(DuaForegroundService.EXTRA_TRANSLITERATION, transliteration)
            putExtra(DuaForegroundService.EXTRA_TRANSLATION, translation)
        }
        context.startService(intent)
        call.resolve()
    }

    @PluginMethod
    fun isRunning(call: PluginCall) {
        val running = DuaForegroundService.isRunning
        call.resolve(com.getcapacitor.JSObject().apply {
            put("running", running)
        })
    }
}
```

### 2. Create `DuaForegroundService.kt`

```kotlin
package app.lovable.fbbd097753d649a0b31453502bf2dd53

import android.app.*
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.text.Html
import android.text.SpannableString
import android.text.Spanned
import android.text.style.StyleSpan
import androidx.core.app.NotificationCompat
import android.graphics.Typeface
import kotlin.random.Random

class DuaForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "dua_foreground_channel"
        const val NOTIFICATION_ID = 2001
        const val ACTION_START = "START_SERVICE"
        const val ACTION_STOP = "STOP_SERVICE"
        const val ACTION_UPDATE = "UPDATE_NOTIFICATION"
        const val EXTRA_ARABIC = "arabic"
        const val EXTRA_TRANSLITERATION = "transliteration"
        const val EXTRA_TRANSLATION = "translation"
        const val EXTRA_INTERVAL = "interval"
        
        var isRunning = false
            private set
    }

    private var handler: Handler? = null
    private var updateRunnable: Runnable? = null
    private var intervalMs: Long = 3600000L // Default 1 hour

    private var currentArabic = ""
    private var currentTransliteration = ""
    private var currentTranslation = ""

    // Sample duas for rotation (these are fetched from the app initially)
    private val sampleDuas = listOf(
        Triple(
            "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
            "Subhanallahi wa bihamdihi",
            "Glory is to Allah and praise is to Him"
        ),
        Triple(
            "لَا إِلَـٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
            "La ilaha illallahu wahdahu la shareeka lah",
            "None has the right to be worshipped except Allah, alone"
        ),
        Triple(
            "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
            "Astaghfirullaha wa atubu ilayhi",
            "I seek Allah's forgiveness and turn to Him"
        ),
        Triple(
            "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
            "La hawla wa la quwwata illa billah",
            "There is no power nor strength except with Allah"
        ),
        Triple(
            "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَـٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
            "Subhanallah wal hamdulillah wa la ilaha illallah wallahu akbar",
            "Glory be to Allah, praise be to Allah, there is no god but Allah, Allah is the Greatest"
        ),
        Triple(
            "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
            "Allahumma salli 'ala Muhammad wa 'ala aali Muhammad",
            "O Allah, send blessings upon Muhammad and upon the family of Muhammad"
        ),
        Triple(
            "حَسْبِيَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ",
            "Hasbiyallahu la ilaha illa huwa 'alayhi tawakkaltu",
            "Allah is sufficient for me, there is no god but He, upon Him I rely"
        ),
        Triple(
            "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
            "Bismillahil ladhi la yadurru ma'asmihi shay'",
            "In the name of Allah with whose name nothing can harm"
        )
    )

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        handler = Handler(Looper.getMainLooper())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                currentArabic = intent.getStringExtra(EXTRA_ARABIC) ?: getRandomDua().first
                currentTransliteration = intent.getStringExtra(EXTRA_TRANSLITERATION) ?: getRandomDua().second
                currentTranslation = intent.getStringExtra(EXTRA_TRANSLATION) ?: getRandomDua().third
                intervalMs = intent.getLongExtra(EXTRA_INTERVAL, 3600000L)
                
                startForeground(NOTIFICATION_ID, createNotification())
                isRunning = true
                startPeriodicUpdates()
            }
            ACTION_STOP -> {
                stopPeriodicUpdates()
                stopForeground(true)
                stopSelf()
                isRunning = false
            }
            ACTION_UPDATE -> {
                currentArabic = intent.getStringExtra(EXTRA_ARABIC) ?: currentArabic
                currentTransliteration = intent.getStringExtra(EXTRA_TRANSLITERATION) ?: currentTransliteration
                currentTranslation = intent.getStringExtra(EXTRA_TRANSLATION) ?: currentTranslation
                updateNotification()
            }
        }
        return START_STICKY
    }

    private fun getRandomDua(): Triple<String, String, String> {
        return sampleDuas[Random.nextInt(sampleDuas.size)]
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "أذكار المسلم",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Continuous Dua notifications"
                enableLights(true)
                lightColor = Color.GREEN
                setShowBadge(false)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }

            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        val intent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Create styled text with bold Arabic
        val bigTextStyle = NotificationCompat.BigTextStyle()
            .bigText("${currentArabic}\n\n${currentTransliteration}\n\n${currentTranslation}")
            .setBigContentTitle("📿 أذكار المسلم")

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("📿 أذكار المسلم")
            .setContentText(currentArabic)
            .setStyle(bigTextStyle)
            .setSmallIcon(android.R.drawable.ic_dialog_info) // Replace with your app icon
            .setOngoing(true) // Cannot be swiped away
            .setAutoCancel(false)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setContentIntent(pendingIntent)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build()
    }

    private fun updateNotification() {
        val manager = getSystemService(NotificationManager::class.java)
        manager?.notify(NOTIFICATION_ID, createNotification())
    }

    private fun startPeriodicUpdates() {
        updateRunnable = object : Runnable {
            override fun run() {
                val dua = getRandomDua()
                currentArabic = dua.first
                currentTransliteration = dua.second
                currentTranslation = dua.third
                updateNotification()
                handler?.postDelayed(this, intervalMs)
            }
        }
        handler?.postDelayed(updateRunnable!!, intervalMs)
    }

    private fun stopPeriodicUpdates() {
        updateRunnable?.let { handler?.removeCallbacks(it) }
    }

    override fun onDestroy() {
        super.onDestroy()
        stopPeriodicUpdates()
        isRunning = false
    }
}
```

### 3. Create `BootReceiver.kt`

```kotlin
package app.lovable.fbbd097753d649a0b31453502bf2dd53

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            // Check if the service was enabled before restart
            val prefs = context.getSharedPreferences("ForegroundDuaPrefs", Context.MODE_PRIVATE)
            val wasEnabled = prefs.getBoolean("enabled", false)
            
            if (wasEnabled) {
                val serviceIntent = Intent(context, DuaForegroundService::class.java).apply {
                    action = DuaForegroundService.ACTION_START
                }
                
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(serviceIntent)
                } else {
                    context.startService(serviceIntent)
                }
            }
        }
    }
}
```

## 4. Update AndroidManifest.xml

Add these permissions and components inside `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Add these permissions inside the <manifest> tag -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.WAKE_LOCK" />

<!-- Add these inside the <application> tag -->
<service
    android:name=".DuaForegroundService"
    android:enabled="true"
    android:exported="false"
    android:foregroundServiceType="dataSync" />

<receiver
    android:name=".BootReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>
```

## 5. Register the Plugin in MainActivity.kt

Edit `android/app/src/main/java/app/lovable/fbbd097753d649a0b31453502bf2dd53/MainActivity.kt`:

```kotlin
package app.lovable.fbbd097753d649a0b31453502bf2dd53

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(ForegroundDuaPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
```

## Setup Steps

1. Export to GitHub from Lovable
2. Clone the repository locally
3. Run `npm install`
4. Run `npx cap add android`
5. Create the Kotlin files listed above in `android/app/src/main/java/app/lovable/fbbd097753d649a0b31453502bf2dd53/`
6. Update `AndroidManifest.xml` with the permissions and components
7. Update `MainActivity.kt` to register the plugin
8. Run `npx cap sync android`
9. Open in Android Studio: `npx cap open android`
10. Build and run on your device

## Testing

1. Open the app and go to Prayer Settings
2. Enable "الأذكار خارج التطبيق" (Azkaar Outside App)
3. The persistent notification should appear
4. Close the app completely - the notification should remain
5. Restart your phone - the notification should reappear after boot
