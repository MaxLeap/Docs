---
title: Push Notification Guide
---

# Push Notifications

Push notifications is a great way to keep your users engaged in and informed about your app. You can reach your entire user base quickly and effectively. This guide will help you untangle the setup process and the general usage of LAS about sending push notifications.

If you haven't installed the SDK yet, [head over to the Push QuickStart][android quick start] to get our SDK up and running.

## Setting Up Push

If you want to start using push, start from completing the [Android Push Tutorial](android_push_tutorial) to learn how to configure your app. Come back to this guide afterwards to learn more about the push features offered by LAS.

The LAS library provides push notifications using Google Cloud Messaging (GCM) if possible.

When sending pushes to Android devices with GCM, there are several pieces of information that LAS keeps track of automatically:

- **Registration ID**: The GCM registration ID uniquely identifies an app/device pairing for push purposes.

- **Sender ID**: The GCM sender ID is a public number that identifies the sender of a push notification.

- **API key**: The GCM API key is a server secret that allows a server to send pushes to a registration ID on behalf of a particular sender ID.

The LAS Android SDK chooses a reasonable default configuration so that you do not have to worry about GCM registration ids, sender ids, or API keys. In particular, the SDK will automatically register your app for push at startup time using LAS's sender ID (1076345567071) and will store the resulting registration ID in the `deviceToken` field of the app's current LASInstallation.

Moreover, as an advanced feature for developers that want to send pushes from multiple push providers, LAS allows you to optionally register your app for pushes with additional GCM sender IDs. To do this, please specify the additional GCM sender ID with the following `<meta-data>` tag as a child of the `<application>` element in your app's `AndroidManifest.xml`:

```xml
<meta-data android:name="com.las.push.gcm_sender_id"
           android:value="id:YOUR_SENDER_ID" />;
```

In the sample snippet above, YOUR_SENDER_ID should be replaced by a numeric GCM sender ID. Note that the LAS SDK expects you to prefix your sender ID with an `id:` prefix, as shown in the sample snippet.

If you want to register your app with multiple additional sender IDs, then the `android:value` in the `<meta-data>` element above should hold a comma-delimited list of sender IDs, as in the following snippet:

```xml
<meta-data android:name="com.las.push.gcm_sender_id"
           android:value="id:YOUR_SENDER_ID_1,YOUR_SENDER_ID_2,YOUR_SENDER_ID_3" />;
```

## Installations

Every LAS application installed on a device registered for push notifications has an associated `Installation` object. The `Installation` object is where you store all the data needed to target push notifications. For example, in a baseball app, you could store the teams a user is interested in to send updates about their performance.

In Android,` Installation` objects are available through the `LASInstallation` class, a subclass of `LASObject`. It uses the [same API][android guide #objects] for storing and retrieving data. To access the current `Installation` object from your Android app, use the `LASInstallation.getCurrentInstallation()` method.

While it is possible to modify a `LASInstallation` just like you would modify a `LASbject`, there are several special fields that could help manage and target devices.

- **channels**: An array of the channels to which a device is currently subscribed.

- **timeZone**: The current time zone where the target device is located. This value is synchronized every time an Installation object is saved from the device (readonly).

- **deviceType**: The type of device, "ios" or "android" (readonly).

- **pushType**: This field is reserved for directing LAS to the push delivery network to be used. If the device is registered to receive pushes via GCM, this field will be marked "gcm". If this device is not using GCM, it will be blank (readonly).

- **GCMSenderId**: This field is meant for Android installations that use the GCM push type. It is reserved for directing LAS to send pushes to this installation with an alternate GCM sender ID. This field should generally not be set unless you are uploading installation data from another push provider. If you set this field, then you must set the GCM API key corresponding to this GCM sender ID in your LAS application's push settings.

- **installationId**: Unique Id for the device used by LAS (readonly).

- **deviceToken**: The token used by GCM to keep track of registration ID (readonly).

- **appName**: The display name of the client application to which this installation belongs (readonly).

- **appVersion**: The version string of the client application to which this installation belongs (readonly).

- **sdkVersion**: The version of the LAS SDK which this installation uses (readonly).

## Sending Pushes

There are two ways to send push notifications using LAS: [channels][push channels] and [advanced targeting][advanced targeting]. Channels offers a simple and easy way to use model for sending pushes, while advanced targeting offers a more powerful and flexible model. Both are fully compatible with each other and will be covered in this section.

Sending notifications is often done with the leap.as push console, the [REST API][rest api guide] or [Cloud Code][cloud code guide]. However, push notifications can also be triggered by the existing client SDKs. If you decide to send notifications from the client SDKs, you will need to set **Client Push Enabled** in the Push Notifications settings of your LAS app.

However, be sure you understand that enabling Client Push can lead to a security vulnerability in your app, as outlined [on our blog][leapas blog]. We recommend that you enable Client Push for testing purposes only, and move your push notification logic into Cloud Code when your app is ready to go into production.

You can view your past push notifications on the leap.as push console for up to 30 days after creating your push. For pushes scheduled in the future, you can delete the push on the push console as long as no sends have happened yet. After you send the push, the push console shows push analytics graphs.

### USING CHANNELS

The simplest way to start sending notifications is using channels. This allows you to use a publisher-subscriber model for sending pushes. Notifications can be sent to those device owners after they subscribed to one or more channels. The channels subscribed by a given `Installation` are stored in the `channels` field of the `Installation` object.

### SUBSCRIBING TO CHANNELS

A channel is identified by a string that starts with a letter and consists of alphanumeric characters, underscores, and dashes. It doesn't need to be explicitly created before it can be used and each `Installation` can subscribe to any number of channels at a time.

Subscribing to a channel can be done with a single method call. For example, in a baseball score app, we could do:

```java
// When users indicate they are Giants fans, we subscribe them to that channel.
LASPushManager.subscribeInBackground("Giants", new SaveCallback() {
    @Override
    public void done(LASException exception) {
    }
});
```

By default, the main activity for your app will be running when a user responds to notifications.


Once subscribed to the "Giants" channel, your `Installation` object should have an updated `channels` field.



Unsubscribing from a channel is just as easy:

```java
// When users indicate they are no longer Giants fans, we unsubscribe them.
LASPushManager.unsubscribeInBackground("Giants", new SaveCallback() {
    @Override
    public void done(LASException exception) {
    }
});
```

You can also get the set of channels that the current device is subscribed to with:

```java
List<String> subscribedChannels = LASInstallation.getCurrentInstallation().getList("channels");
```

Neither the subscribe method nor the unsubscribe method blocks the thread it is called from. The subscription information is cached on the device's disk if the network is inaccessible and transmitted to the LAS Cloud as soon as the network is usable, which means you don't have to worry about threading or callbacks while managing subscriptions.

### SEND PUSHES TO CHANNELS

In the Android SDK, the following code can be used to alert all subscribers of the "Giants" channel that their favorite team just scored. This will display a notification center alert to iOS users and a system tray notification to Android users.

```java
LASPush push = new LASPush();
push.setChannel("Giants");
push.setMessage("The Giants just scored! It's now 2-2 against the Mets.");
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```

If you want to target multiple channels with a single push notification, you can use a `LinkedList` of channels.

```java
LinkedList<String> channels = new LinkedList<String>();
channels.add("Giants");
channels.add("Mets");

LASPush push = new LASPush();
push.setChannels(channels); // Notice we use setChannels not setChannel
push.setMessage("The Giants won against the Mets 2-3.");
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```

### USING ADVANCED TARGETING

While channels are great for many applications, sometimes you need more precision when targeting the recipients of your pushes. LAS allows you to write a query for any subset of your `Installation` objects using the [query API][android guide #queries] and send them a push.

Since `LASInstallation` is a subclass of `LASObject`, you can save any data you want and even create relationships between `Installation` objects and your other objects. This allows you to send pushes to a very customized and dynamic segment of your user base.

### SAVING INSTALLATION DATA

Storing data on an `Installation` object is just as easy as storing [any other data][android guide #objects] on LAS. In our Baseball app, we could allow users to get pushes about game results, scores and injury reports.

```java
// Store app language and version
LASInstallation installation = LASInstallation.getCurrentInstallation();
installation.put("scores",true);
installation.put("gameResults",true);
installation.put("injuryReports",true);
LASInstallationManager.saveInBackground(installation, new SaveCallback() {
    @Override
    public void done(LASException exception) {
    }
});
```

You can even create relationships between your `Installation` objects and other classes saved on `LAS`. To associate an Installation with a particular user, for example, you can simply store the current user on the `LASInstallation`.

```java
// Associate the device with a user
LASInstallation installation = LASInstallation.getCurrentInstallation();
installation.put("user",LASUser.getCurrentUser());
LASInstallationManager.saveInBackground(installation, new SaveCallback() {
    @Override
    public void done(LASException exception) {
    }
});
```

### SENDING PUSHES TO QUERIES

Once you have your data stored on your `Installation` objects, you can use a `LASQuery` to target a subset of these devices. `Installation` queries work just like any other [LAS query][android guide #queries], but we use the special static method `LASInstallation.getQuery()` to create it. We set this query on our LASPush object, before sending the notification.

```java
// Create our Installation query
LASQuery pushQuery = LASInstallation.getQuery();
pushQuery.whereEqualTo("injuryReports", true);

// Send push notification to query
LASPush push = new LASPush();
push.setQuery(pushQuery); // Set our Installation query
push.setMessage("Willie Hayes injured by own pop fly.");
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```

We can even use channels with our query. To send a push to all subscribers of the "Giants" channel but filtered by those who want score update, we can do the following:

```java
// Create our Installation query
LASQuery pushQuery = LASInstallation.getQuery();
pushQuery.whereEqualTo("channels", "Giants"); // Set the channel
pushQuery.whereEqualTo("scores", true);

// Send push notification to query
LASPush push = new LASPush();
push.setQuery(pushQuery);
push.setMessage("Giants scored against the A's! It's now 2-2.");
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```

If we store relationships to other objects in our `Installation` class, we can also use those in our query. For example, we could send a push notification to all users near a given location like this.

```java
// Find users near a given location
LASQuery userQuery = LASUser.getQuery();
userQuery.whereWithinMiles("location", stadiumLocation, 1.0)

// Find devices associated with these users
LASQuery pushQuery = LASInstallation.getQuery();
pushQuery.whereMatchesQuery("user", userQuery);

// Send push notification to query
LASPush push = new LASPush();
push.setQuery(pushQuery); // Set our Installation query
push.setMessage("Free hotdogs at the LAS concession stand!");
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```

## Sending Options

Push notifications can do more than just send a message. In Android, pushes can also include custom data you wish to send. You have complete control of how you handle the data included in your push notification as we will see in the `Receiving Notifications section`. An expiration date can also be set for the notification in case it is time sensitive.

### CUSTOMIZING YOUR NOTIFICATIONS

If you want to send more than just a message, you will need to use a `JSONObject` to package all of the data. There are some reserved fields that have a special meaning in Android.

- alert: the notification's message.

- uri: (Android only) an optional field that contains a URI. When the notification is opened, an `Activity` associated with opening the URI is launched.

- title: (Android, Windows 8, & Windows Phone 8 only) the value displayed in the Android system tray or Windows 8 toast notification.

For example, to send a notification that would increase the badge number by 1 and play a custom sound, you can do the following. Note that you can set these properties from your Android client, but they would only take effect in the iOS version of your app. The badge and sound fields would have no effects for Android recipients.

```java
JSONObject data = new JSONObject("{\"alert\": \"The Mets scored!\",
                                   \"badge\": \"Increment\",
                                   \"sound\": \"cheering.caf\"}");

LASPush push = new LASPush();
push.setChannel("Mets");
push.setData(data);
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```

It is also possible to specify your own data in this dictionary. As we'll see in the [Receiving Notifications][receiving notifications guide], you're able to use the data sent with your push to do custom processing when a user receives and interacts with a notification.

```java
JSONObject data = new JSONObject("{\"name\": \"Vaughn\",
                                   \"newsItem\": \"Man bites dog\"}"));

LASPush push = new LASPush();
push.setQuery(injuryReportsQuery);
push.setChannel("Indians");
push.setData(data);
LASPushManager.sendInBackground(push, new SendCallback() {

    @Override
    public void done(LASException exception) {
    }
});
```


## Receiving Pushes

When a push notification is received, the “title” is displayed in the status bar and the “alert” is displayed alongside the “title” when the user expands the notification drawer.

Make sure you've gone through the [Android Push QuickStart][android push quickstart] to set up your app to receive pushes. The quickstart shows you how to set up push for all Android devices, including ones that do not support GCM.

Note that some Android emulators (the ones missing Google API support) don't support GCM, so if you test your app in an emulator with this type of configuration, make sure to select an emulator image that has Google APIs installed.

### CUSTOMIZING NOTIFICATIONS

#### CUSTOMIZING NOTIFICATION ICONS

The [Android style guide][android style guide] recommends apps use a push icon that is monochromatic and flat. The default push icon is your application's launcher icon, which is unlikely to conform to the style guide. To provide a custom push icon, add the following metadata tag to your app's AndroidManifest.xml:

```xml
<meta-data android:name="com.las.push.notification_icon" android:resource="@drawable/push_icon"/>
```

The `push_icon` just mentioned is the name of a drawable resource in your package. If your application needs more than one small icon, you can override `getSmallIconId` in your `LASPushBroadcastReceiver` subclass.

If your push has a unique context associated with an image, such as the avatar of the user who sent a message, you can use a large push icon to call attention to the notification. When a notification has a large push icon, your app's static (small) push icon is moved to the lower right corner of the notification and the large icon takes its place. See the [Android UI documentation][android ui] for examples. To provide a large icon, you can override `getLargeIcon` in your `LASPushBroadcastReceiver` subclass.

#### RESPONDING WITH A CUSTOM ACTIVITY

If your push has no "uri" parameter, `onPushOpen` will invoke your application's launcher activity. To customize this behavior, you can override `getActivity` in your `LASPushBroadcastReceiver` subclass.

#### RESPONDING WITH A URI

If you provide a "uri" field in your push, the `LASPushBroadcastReceiver` will open that URI when the notification is opened. If there are multiple apps capable of opening the URI, a dialog will displayed for the user. The `LASPushBroadcastReceiver` will manage your back stack and ensure that clicking back from the Activity handling URI will navigate the user back to the activity returned by `getActivity`.

After you send your pushes to experiment groups, we'll also provide a statistical confidence interval when your experiment has collected enough data to have statistically significant results. This confidence interval is in absolute percentage points of push open rate (e.g. if the open rates for groups A and B are 3% and 5%, then the difference is reported as 2 percentage points). This confidence interval is a measure of how much difference you would expect to see between the two groups if you repeat the same experiment many times.

Just after a push send, when only a small number of users have opened their push notifications, the open rate difference you see between groups A and B could be due to random chance, so it might not be reproducible if you run the same experiment again. After your experiment collects more data over time, we become increasingly confident that the observed difference is a true difference. As this happens, the confidence interval will become narrower, allowing us to more accurately estimate the true difference between groups A and B. Therefore, we recommend that you wait until there is enough data to generate a statistical confidence interval before deciding which group's push is better.

## Troubleshooting

Setting up Push Notifications is often a source of frustration for developers. The process is complicated and invites problems to happen along the way. If you run into issues, try some of these troubleshooting tips.

- [Upgrade to the latest SDK][download sdk]. This documentation covers the push API introduced in the 1.7.0 version of the Android LAS SDK. Please upgrade if you are getting compiler errors following these instructions.

- Make sure you have the correct permissions listed in your `AndroidManifest.xml` file, as outlined in steps 4 and 6 of the ]Android Push Quickstart][android push quickstart]. If you are using a custom receiver, be sure you have registered it in the Manifest file with the correct `android:name` property and the proper intent filters.

- Make sure you've used the correct App ID and client key, and that `LASConfig.initialize()` is being called. `LASConfig.initialize()` lets the service know which application it is listening for; we suggest putting this code in the `Application.onCreate` rather than the `onCreate` method for a particular Activity, so that any activation technique will know how to use LAS.

- Check that the device is set to accept push notifications from your app.

- Check the number of recipients in your LAS Push Console. Does it match the expected number of recipients? Your push might be targeted incorrectly.

- If testing in the emulator, try cleaning and rebuilding your project and restarting your AVD.* Turn on verbose logging with `LASConfig.setLogLevel(LASConfig.LOG_LEVEL_VERBOSE)`. The error messages will be a helpful guide to what may be going on.

- If you see the message "Finished (with error)" in your Dashboard, check your verbose logs. If you are performing pushes from a device, check that client-side push is enabled in your dashboard.

- In your logs, you may see an error message, "Could not construct writer" or other issues related to a broken pipe. When this occurs, the framework will continue to try reconnecting. It should not crash your app.* If your app has been released for a while, it's possible for the recipient estimate on the push composer page to be higher than the pushes sent value on the push results page. The push composer estimate is generated via running your push segment query over your app's installation table. We do not automatically delete installation objects when the users uninstall your app. When we try to send a push, we detect uninstalled installations and do not include them in the pushes sent value on the results page.


[android quick start]: ../../quickstart/android/existing.html
[android_push_tutorial]: about:blank
[android guide #objects]: ../../docs/cloudData/android.html#Objects
[push channels]: #UsingChannels
[advanced targeting]: #UsingAdvancedTargeting
[rest api guide]: about:blank
[cloud code guide]: about:blank
[leapas blog]: about:blank
[android guide #queries]: ../../docs/cloudData/android.html#Queries
[android style guide]: http://developer.android.com/design/style/iconography.html#notification
[android push quickstart]: about:blank
[android ui]: http://developer.android.com/guide/topics/ui/notifiers/notifications.html#NotificationUI