# TODO

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

# Test the SDK
After installing the SDK, copy and paste this code into your app, for example in ==Application.onCreate()==:

```java
ZCloudObject testObject = new ZCloudObject("TestObject");
testObject.put("foo", "bar");
ZCloudDataManager.saveInBackground(testObject);
```

Run your app. A new object of class ==TestObject== will be sent to the ZCloud Cloud and saved. When you're ready, click the button below to test if your data was sent.