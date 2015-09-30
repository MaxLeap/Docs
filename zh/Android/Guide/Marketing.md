#营销
##简介
###什么是MaxLeap Marketing服务

Marketing服务是MaxLeap提供的营销和信息发布功能。目前提供两种Marketing形式：Push Notification和In-App Message.您可以通过推送消息方式向指定人群推送消息，也可以通过In-App Message，在应用内向有某种行为的用户显示特定内容。您还可以在消息中设置用户点击后的目标Activity。消息的创建，设置和发送均在Console中完成。

###为何需要MaxLeap Marketing服务

结合MaxLeap分析服务提供的分析数据，以及MaxLeap Users服务提供的Segment，您可以高效地制定营销策略，并且通过Marketing服务实施您的策略。MaxLeap Marketing服务的优势在于：


* **提高转化率：**随时向用户发布营销活动，维持用户活跃度并提高转化率
* **保障用户体验：**选择向指定Segment发送消息，更具有针对性
* **动态内容管理：**Push Notification和In-App Message中的内容均在Console中设置，用户所见内容可实时更新

## 推送消息
推送消息帮助您迅速地将消息展示给大量的用户。发送推送消息后，无论用户是否打开应用，都将在状态栏看见它。您可以在Console中自定义发送消息的内容，并且传递若干参数(键值对)至客户端。用户点击推送消息后，应用会根据参数决定目标Activity。

###配置
MaxLeap Core SDK 提供了一套完整的基于GCM的推送方案。GCM(Google Cloud Messaging)是谷歌提供的推送服务。使用GCM进行推送，您需要完成以下设置：

1. 提供 **Sender ID** 和 **API key**. 请在*Google开发者中心*获取这两个Key.
2. 在 `AndroidManifest.xml` 中添加权限和Push Receiver(用于处理 Push 消息及显示 Notification)：

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

3. **配置Sender ID：**在 `AndroidManifest.xml`的`<application ...> </application>`中添加：

```xml
<meta-data
	android:name="com.maxleap.push.gcm_sender_id"
	android:value="id:YOUR_SENDER_ID" />
```

4. **配置推送消息图标：**若不配置，将默认采用应用的图标作为推送消息图标进行显示。

```xml
<meta-data
	android:name="com.maxleap.push.notification_icon"
	android:resource="@android:drawable/ic_dialog_alert" />
```
5. **启用Marketing服务：**在`Application.onCreate()`中的`MaxLeap.initialize()`方法**之前**添加：

```java
MaxLeap.setMarketingEnabled(true);
```

注意：

* 请将上述YOUR\_PACKAGE\_NAME字段替换成项目的Package名。将YOUR\_SENDER\_ID替换成您的GCM Sender ID.

###自定义推送消息的处理

您可以通过以下步骤自定义推送消息的显示和处理。

1. 新建CustomPushReceiver类，并继承MLPushBroadcastReceiver
2. 在CustomPushReceiver类中完成一系列自定义：点击后的目标Activity，图标等
3. 在`AndroidManifest.xml`中配置CustomPushReceiver

#####新建Receiver

```java
public class CustomPushReceiver extends MLPushBroadcastReceiver {
	@Override
	protected class<? extends Activity> getActivity(Intent intent) {
		return YOUR_ACTIVITY.class;
	}
	@Override
	protected Uri getUri(Intent intent) {
		return super.getUri(intent);
	}
}
```

#####自定义：目标Activity
```java
protected class<? extends Activity> getActivity(Intent intent)
```

返回非 null 值后，点击 Notification 后会自动进入到目标Activity，在目标Activity中可以通过 `getIntent()` 得到该条 Push 所携带的信息

```java
Intent intent = getIntent();
if (intent != null && intent.getExtras() != null) {
    for (String key : intent.getExtras().keySet()) {
        MLLog.i(TAG, key + " = " + intent.getStringExtra(key));
    }
}
```

#####自定义：目标Uri
```java
protected Uri getUri(Intent intent)
```

返回非 null 值后，点击 Notification 后会自动进入目标Uri

注意：getActivity() 的优先级要高于 getUri()。如果 getActivity（）没有返回 null 的话，则 getUri() 会被忽略

#####其他自定义
定义 Notification 的 LargeIcon

```java
 protected Bitmap getLargeIcon(Context context)
```

自定义 Notificatioin 的 SmallIcon

```java
protected int getSmallIconId(Context context)
```

或者如之前所述，在 `AndroidManifest.xml` 中配置

```xml
<meta-data
    android:name="com.maxleap.push.notification_icon"
    android:resource="@android:drawable/ic_dialog_alert" />
```

修改 Intent：如果希望修改点击 Notification 获得的 Intent 的信息（如 Intent 的 Flag），可以重写如下代码

```java
@Override
protected void startIntent(Context context, Intent intent) {
	// 修改 Intent 的 Flag 信息
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    super.startIntent(context, intent);
}
```

完全自定义 Notification：如果希望自己创建 Notification 对象，可以重写如下方法

```java
protected Notification getNotification(Context context, Intent intent)
```

#####配置CustomPushReceiver
用下列Receiver替换默认的`com.maxleap.MLPushBroadcastReceiver`：

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

## 应用内消息

###配置
为了使用应用内消息服务，您需要**启用Marketing服务：**在`Application.onCreate()`中的`MaxLeap.initialize()`方法**之前**添加：

```java
MaxLeap.setMarketingEnabled(true);
```

###定义目标Activity
您可以在Console新建应用内消息时，自定义用户点击后进入到目标Activity(详细步骤，请查看[Console使用指南－Marketing](ML_DOCS_LINK_PLACEHOLDER_USERMANUAL))。假设我们在Console定义某个应用内消息时，指定用户点击后的目标Activity为`InAppMessageActivity`，则您需要在开发时新建`InAppMessageActivity`，并继承`AppCompatActivity`：

在`InAppMessageActivity`中，您可以通过`getIntent()`获取该应用内消息的参数。

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

并在`onResume()`和`onPause()`方法中添加如下代码：

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