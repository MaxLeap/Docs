# Marketing
##Introduction
###What is MaxLeap Marketing

Marketing is a promotion and message issuance service provided by MaxLeap. There are two marketing types for you to choose: Push Notification and In-app Message. You can send Push Notifications to a certain group of people and show specific messages to a segment with In-app Message. You can even set the Target Activity on user's click. The creation, settings and sending are all done in Console.

###Why is MaxLeap Marketing Necessary 
With data from Analytics and Segment provided by MaxLeap Users, you can make and implement marketing strategies with high efficiency. The advantages of MaxLeap Marketing can be summarized as follows: 

* **Improve Penetrance: **Issue marketing campaign at any time to improve the user engagement and penetrance
* **Ensure the user experience: **More targeted to send messages to certain Segment 
* **Dynamic Content Management: **The content of Push Notifications and In-app Messages can be modified and updated in real time in Console.

## Push Notification
Push Notification helps you show messages to plenty of users. After you send the message, users can see it in status bar whether they open the app or not. You can customize message content in Console and send several properties (Key-Vaule) to clients. The application will determine the Target Activity according to the property after users tap on the push.

###Configuration
MaxLeap Core SDK provides a whole set of push project based on GCM. GCM (Google Cloud Messaging) is a free service that helps developers send messages across multiple platforms. You need to complete following settings to use GCM: 

1. Provide **Sender ID** and **API key**. Please get those two keys in [Google Developer Center](..). 
2. Add permission and Push Receiver (used to handle Push and show Notification) in `AndroidManifest.xml`:

```xml
<!-- your package -->
<permission
	android:name="YOUR_PACKAGE_NAME.permission.C2D_MESSAGE"
	android:protectionLevel="signature" />
<uses-permission android:name="YOUR_PACKAGE_NAME.permission.C2D_MESSAGE" />

<!-- App receives GCM messages. -->
<uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />
<!-- GCM requires a Google account. -->
<uses-permission android:name="android.permission.GET_ACCOUNTS" />
<!-- Keeps the processor from sleeping when a message is received. -->
<uses-permission android:name="android.permission.WAKE_LOCK" />

<application ...>
	<!-- play services -->
	<meta-data
		android:name="com.google.android.gms.version"
		android:value="@integer/google_play_services_version" />

	<receiver
	android:name="com.maxleap.push.GcmBroadcastReceiver"
	android:permission="com.google.android.c2dm.permission.SEND">
	<intent-filter>
		<action android:name="com.google.android.c2dm.intent.RECEIVE" />
		<action android:name="com.google.android.c2dm.intent.REGISTRATION" />

		<category android:name="YOUR_PACKAGE_NAME" />
	</intent-filter>
	</receiver>

	<receiver android:name="com.maxleap.MLPushBroadcastReceiver" android:exported="false">
	<intent-filter>
		<action android:name="com.maxleap.push.intent.RECEIVE"/>
		<action android:name="com.maxleap.push.intent.OPEN"/>
	</intent-filter>
	</receiver>
</application>
```
3. **Config Sender ID：** Adding following code in `<application ...> </application>` in `AndroidManifest.xml`:

```xml
<meta-data
	android:name="com.maxleap.push.gcm_sender_id"
	android:value="id:YOUR_SENDER_ID" />
```

4. **Config Push Icon：** It will use the app icon as the notification icon by default if there's no configuration.

```xml
<meta-data
	android:name="com.maxleap.push.notification_icon"
	android:resource="@android:drawable/ic_dialog_alert" />
```
5. **Enable Marketing Service：**Add following code **Before** `MaxLeap.initialize()` in `Application.onCreate()`: 

```java
MaxLeap.setMarketingEnabled(true);
```

Notice:

* Please replace the aforementioned YOUR\_PACKAGE\_NAME with project Package name and replace YOUR\_SENDER\_ID with GCM Sender ID.

###Customize Push Processing

You can customize the display and processing with following steps:

1. Add new CustomPushReceiver class and inherit MLPushBroadcastReceiver 
2. Customize CustomPushReceiver, including Target Activity, icon, etc.
3. Config CustomPushReceiver in `AndroidManifest.xml` 

#####Add New Receiver

```java
public class CustomPushReceiver extends MLPushBroadcastReceiver {
	@Override
	protected Class<? extends Activity> getActivity(Intent intent) {
		return YOUR_ACTIVITY.class;
	}
	@Override
	protected Uri getUri(Intent intent) {
		return super.getUri(intent);
	}
}
```

#####Customization: Target Activity

```java
protected Class<? extends Activity> getActivity(Intent intent)
```

After returns with a non-null value, it will enter Target Activity automatically on tapping Notification. In this Target Activity, the message carried by the Push can be got with `getIntent()`. 

```java
Intent intent = getIntent();
if (intent != null && intent.getExtras() != null) {
    for (String key : intent.getExtras().keySet()) {
        MLLog.i(TAG, key + " = " + intent.getStringExtra(key));
    }
}
```

#####Customization: Target Uri

```java
protected Uri getUri(Intent intent)
```

After returns with a non-null value, it will enter Target Uri automatically on tapping Notification.

Notice: getActivity() takes precedence over getUri(). If getActivity（）doesn't returns null, then getUri() will be ignored. 

#####Other Customization 
Config Notification LargeIcon

```java
 protected Bitmap getLargeIcon(Context context)
```

Config Notificatioin SmallIcon

```java
protected int getSmallIconId(Context context)
```

Or, you can config in `AndroidManifest.xml` as aforementioned 

```xml
<meta-data
    android:name="com.maxleap.push.notification_icon"
    android:resource="@android:drawable/ic_dialog_alert" />
```

Modify Intent: If you want to modify the Intent info got by tapping the Notification (like the Intent Flag), please override following code 

```java
@Override
protected void startIntent(Context context, Intent intent) {
	// Set flag for intent
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    super.startIntent(context, intent);
}
```

Completely Customize Notification：If you want to create Notification object all by yourself, please override following method

```java
protected Notification getNotification(Context context, Intent intent)
```

#####Config CustomPushReceiver
Replace default `com.maxleap.MLPushBroadcastReceiver` with following Receiver：

```xml
<receiver
    android:name=".CustomPushReceiver"
    android:exported="false">
    <intent-filter>
        <action android:name="com.maxleap.push.intent.RECEIVE" />
        <action android:name="com.maxleap.push.intent.OPEN" />
    </intent-filter>
</receiver>
```

## In-app Message

###Configuration
In order to user in-app message, you need to **enable Marketing service：** add following code before `MaxLeap.initialize()` in `Application.onCreate()` :

```java
MaxLeap.setMarketingEnabled(true);
```

###Define Target Activity
When you create new in-app message in Console, you can customize Target Activity on tapping the message. (For more details, please check [Console Guide－Marketing](。。)). Suppose that we set `InAppMessageActivity` as the Target Avtivity when defining in-app message in Console, then we need to add new `InAppMessageActivity` and inherit `AppCompatActivity` while developing: 

The message carried by this in-app message can be got by `getIntent()` in the `InAppMessageActivity`.

```java
protected void onCreate(Bundle savedInstanceState) {
	Intent intent = getIntent();
	if (intent != null && intent.getExtras() != null) {
		for (String key : intent.getExtras().keySet()) {
			MLLog.i(TAG, key + " = " + intent.getStringExtra(key));
		}
	}
}
```

and add code in `onResume()` and `onPause()`

```java
@Override
protected void onResume() {
		super.onResume();
	MLMarketing.setInAppMessageDisplayActivity(this);
	MLAnalytics.onResume(this);
}

@Override
protected void onPause() {
		super.onPause();
	MLMarketing.dismissCurrentInAppMessage();
	MLMarketing.clearInAppMessageDisplayActivity();
	MLAnalytics.onPause(this);
}
```