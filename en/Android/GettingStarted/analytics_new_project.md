# Install the SDK
## 1. Download & unzip the Project
[Download the blank Android project](http://www.baidu.com)

## 2. Open the project
### Android Studio

Unzip ==ZCloudStarterProject.==

In Android Studio, go to== File -> Open...==

Select ==build.gradle== in the root of ZCloudStarterProject.

### Eclipse
Unzip the file and move the ==ZCloudStarterProject==into your workspace directory.

In Eclipse, go to ==File -> Import...==

Click ==General -> Existing Projects into Workspace==

Make sure the "Select root directory" radio button is selected, and browse to your workspace directory.

In the Projects box, check the box next to ParseStarterProject and click Finish. (Note: if your workspace isn't already set up for Android, you may need to specify the location of the Android SDK in the Android tab in preferences, in order to get the project to compile.)

# Connect your app to ZCloud
Before continuing, select your ZCloud app from the menu at the right. These steps are for your "TestZCloud" app.

Add your keys to your project:

```java
public void onCreate() {
  ZCloudConfig.initialize(this, "552747b460b287299ce86caa", "dndaRjhyNDEwZkhyNzc2UXFqWEtBdw");
}
```
Compile and run!

# Send Custom Analytics Data

The starter project already records statistics around application opens, but let's try sending some custom data.

ZCloudAnalytics allows you to track free-form events with a handful of string keys and values. These extra dimensions allow you to segment your custom events via your app's Dashboard.

For example, if your app lets people browse the news, you may be interested to see whether they are reading different types of content on weekends and weekdays.

Copy and paste this code into your app, for example in your Application.onCreate: ==Application.onCreate()==:

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