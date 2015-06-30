# Install the SDK
## 1. Download & unzip the Project
[Download the blank Android project](http://www.baidu.com)

## 2. Add the SDK to your app
### Android Studio

Drag the ZCloud-*.jar you downloaded into your existing app's "libs" folder and add the following to your ==build.gradle==

```groovy
dependencies {
    compile fileTree(dir: 'libs', include: 'ZCloud-*.jar')
}
```

### Eclipse

Import the zip file's contents into your existing Android project by extracting it into your "libs" folder. If your project does not already have a "libs" folder, create one at the root of the project by right-clicking the project and choosing "New" and then "Folder".

# Connect your app to ZCloud
Before continuing, select your ZCloud app from the menu at the right. These steps are for your "TestZCloud" app.

Call ==ZCloud.initialize== from the ==onCreate== method of your ==Application== class to set your application id and client key:

```java
public void onCreate() {
  ZCloudConfig.initialize(this, "552747b460b287299ce86caa", "dndaRjhyNDEwZkhyNzc2UXFqWEtBdw");
}
```

Your app must request the INTERNET and ACCESS_NETWORK_STATE permissions, if it isn't doing so already. Add these lines before the ==`<application>`== tag in your ==AndroidManifest.xml==:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Compile and run!

# Send Custom Analytics Data

In the previous step, you sent data to ZCloud to track whether your application had been opened. Next, try sending some custom data.

==ZCloudAnalytics== allows you to track free-form events with a handful of ==string== keys and values. These extra dimensions allow you to segment your custom events via your app's Dashboard.

For example, if your app lets people browse the news, you may be interested to see whether they are reading different types of content on weekends and weekdays.

Copy and paste this code into your app, for example in your ==Application.onCreate==:

```java
Map<String, String> dimensions = new HashMap<String, String>();
// What type of news is this?
dimensions.put("category", "politics");
// Is it a weekday or the weekend?
dimensions.put("dayType", "weekday");
// Send the dimensions to ZCloud along with the 'read' event

ZCloudAnalytics.logEvent("read", dimensions);
```

Run your app. You should see new data that we just defined appearing in the Analytics tab of the [Dashboard](http://). Click on the default 'API Requests' button or the date controls to change the data displayed. Selecting '+ Custom Breakdown' will show Custom Events and breakdowns specific to your app. You can also download this data as a CSV by clicking the download button on the top right hand side.

Try adapting ==ZCloudAnalytics== to track different data and see new data segments based on your input in realtime.

When you're ready, click the button below to test if your analytics event was recorded.