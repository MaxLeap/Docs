# 推送营销

## 简介

### 什么是 MaxLeap 推送营销服务

推送营销服务是 MaxLeap 提供的营销和信息发布功能。目前提供两种消息模式：**推送消息** 和 **应用内消息**。

 * 您可以通过推送消息方式向指定人群推送消息，也可以通过应用内消息，在应用内向有某种行为的用户显示特定内容。
 * 您还可以在消息中设置用户点击后的目标 Activity。消息的创建，设置和发送均在Console中完成。


## SDK 集成

请按第二章【SDK 集成】步骤完成 SDK 集成。

## 推送消息

推送消息帮助您迅速地将消息展示给大量的用户。发送推送消息后，无论用户是否打开应用，都将在状态栏看见它。您可以在 Console 中自定义发送消息的内容，并且传递若干参数(键值对)至客户端。用户点击推送消息后，应用会根据参数决定目标 Activity。

目前 MaxLeap 提供两种类型的推送服务：GCM 和 LPNS，GCM 依托于谷歌服务，LPNS 依托于长连接，开发者可以自行选择采用哪种类型。

### GCM

#### 配置

1. 提供 `Sender ID` 和 `API key`. 请在 [Google开发者中心](https://console.developers.google.com) 获取这两个Key.
2. 在 `AndroidManifest.xml` 中进行必要的配置。

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
        <!--渠道-->
        <meta-data
            android:name="ml_channel"
            android:value="google_play" />

        <!--Push 类型-->
        <meta-data
            android:name="ml_push"
            android:value="gcm" />

        <!--senderId-->
        <meta-data
            android:name="com.maxleap.push.gcm_sender_id"
            android:value="id:yourSenderId" />

        <!--Notification 图标（非必需），默认为应用的图标-->
        <meta-data
            android:name="com.maxleap.push.notification_icon"
            android:resource="@android:drawable/ic_dialog_alert" />

        <!--Play Services-->
        <meta-data
            android:name="com.google.android.gms.version"
            android:value="@integer/google_play_services_version" />

        <!--Push 服务-->
        <service
            android:name="com.maxleap.MLPushService"
            android:enabled="true"
            android:exported="false" />

		<!--Receiver-->
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

	**注意**

	请将上述代码中的 `YOUR_PACKAGE_NAME` 换成你的应用的包名，将 `yourSenderId` 替换成你在 Google 开发者控制台上创建的 `senderId`，多个 `senderId` 可以用逗号进行分隔（即 "id:abc" 或 "id:abc,def,ghi" 都是合法的）。


###  LPNS

#### 配置

在 `AndroidManifest.xml` 中添加权限和必要的项目

```xml
<manifest>
	<!--必需-->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />

    <!--可选-->
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />

    <application>

		<!--渠道-->
        <meta-data
            android:name="ml_channel"
            android:value="google_play" />

		<!--Push 类型-->
        <meta-data
            android:name="ml_push"
            android:value="lpns" />

		<!--心跳间隔（非必需），默认为5分钟-->
        <meta-data
	        android:name="ml_push_heartbeat"
    	    android:value="600000" />

        <!--Notification 图标（非必需），默认为应用的图标-->
        <meta-data
            android:name="com.maxleap.push.notification_icon"
            android:resource="@android:drawable/ic_dialog_alert" />

		<!--用于接收 Push 信息-->
        <receiver
            android:name="com.maxleap.MLPushBroadcastReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="com.maxleap.push.intent.RECEIVE" />
                <action android:name="com.maxleap.push.intent.OPEN" />
            </intent-filter>
        </receiver>

        <service
            android:name="com.maxleap.MLPushService"
            android:enabled="true"
            android:exported="false" />

        <!-- 用于进行心跳检测，开机重启服务 -->
        <receiver
            android:name="com.maxleap.MLBootReceiver"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
            </intent-filter>
        </receiver>
        <receiver
            android:name="com.maxleap.MLHeartBeatReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="com.maxleap.push.intent.HEARTBEAT" />
                <action android:name="com.maxleap.push.intent.RECONNECT" />
            </intent-filter>
        </receiver>
    </application>

</manifest>

```

### 自定义推送消息的处理

您可以通过以下步骤自定义推送消息的显示和处理。

1. 新建任意继承自 `MLPushBroadcastReceiver` 的类
2. 在以上步骤创建的类中完成通过方法的重写完成一系列自定义操作
3. 在 `AndroidManifest.xml` 中配置将 `com.maxleap.MLPushBroadcastReceiver` 一项替换成你自定义的类。


#####  跳转到指定的 Activity

重写 `getActivity()` 方法可以指定当点击通知后所跳转的 Activity 画面。

```java
@Override
protected Class<? extends Activity> getActivity(Intent intent) {
    return HelloWorld.class;
}
```

在跳转到的目标 Activity 中可以通过 `getIntent()` 得到该条 Push 所携带的信息

```java
Intent intent = getIntent();
if (intent != null && intent.getExtras() != null) {
    for (String key : intent.getExtras().keySet()) {
        Log.i(TAG, key + " = " + intent.getStringExtra(key));
    }
}
```

##### 跳转到指定的 Uri

重写 `getUri()` 方法可以指定当点击通知后所跳转的 Uri。

```java
@Override
protected Uri getUri(Intent intent) {
    return Uri.parse("http://www.github.com");
}
```

**注意**

`getUri()` 的优先级要高于 `getActivity()`。如果 `getUri()` 没有返回 `null` 的话，则 `getActivity()` 会被忽略。

##### 自定义图标

定义 Notification 的 LargeIcon

```java
@Override
protected Bitmap getLargeIcon(Context context) {
    return BitmapFactory.decodeStream(in);
}
```

自定义 Notification 的 SmallIcon

```java
@Override
protected int getSmallIconId(Context context) {
   return R.drawable.small_icon;
}
```

或者如之前所述，在 `AndroidManifest.xml` 中配置

```xml
<meta-data
    android:name="com.maxleap.push.notification_icon"
    android:resource="@android:drawable/ic_dialog_alert" />
```

##### 修改 Intent

如果你希望在 Activity 或 Uri 跳转前修改 Intent 的信息，，可以重写如下代码

```java
@Override
protected void startIntent(Context context, Intent intent) {
	// 修改 Intent 的 Flag 信息
    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    super.startIntent(context, intent);
}
```

##### 完全自定义 Notification

如果希望自己来实现 Notification 对象，可以重写如下方法

```java
@Override
protected Notification getNotification(Context context, Intent intent)
```

## 应用内消息

### 配置

为了使用应用内消息服务，您需要**启用Marketing服务**，在 `MaxLeap.initialize()`方法中修改默认配置信息：

```java
MaxLeap.Options options = new MaxLeap.Options();
options.appId = APP_ID;
options.clientKey = API_KEY;
options.marketingEnable = true;
options.serverRegion=MaxLeap.REGION_CN;
MaxLeap.initialize(this, options);
```

如果你希望在某个 Activity 中显示应用内消息，则此 Activity 必须继承自 `FragmentActivity` 并且在 `onResume()` 和 `onPause()` 中实现如下方法。

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
