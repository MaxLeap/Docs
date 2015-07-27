# Install the SDK

1. Download & unzip the SDK
    Make sure you are targeting Gingerbread (android-9) or higher.

    <a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/Android/v0.6/las-sdk-all.zip">Download the SDK</a>

2. Add the SDK to your app
    ### Android Studio

    Drag the LAS-*.jar you downloaded into your existing app's "libs" folder and add the following to your `build.gradle`

    ```groovy
    dependencies {
        compile fileTree(dir: 'libs', include: 'LAS-*.jar')
    }
    ```

    ### Eclipse
    
    Import the zip file's contents into your existing Android project by extracting it into your "libs" folder. If your project does not already have a "libs" folder, create one at the root of the project by right-clicking the project and choosing "New" and then "Folder".
    
# Connect your app to LAS
Before continuing, select your LAS app from the menu at the right. These steps are for your "TestLAS" app.

Call `LASConfig.initialize` from the `onCreate` method of your Application class to set your application id and client key:

```java
public void onCreate() {
  LASConfig.initialize(this, "552747b460b287299ce86caa", "dndaRjhyNDEwZkhyNzc2UXFqWEtBdw");
}
```

Your app must request the INTERNET and ACCESS_NETWORK_STATE permissions, if it isn't doing so already. Add these lines before the `<application>` tag in your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
```

# Test the SDK
After installing the SDK, copy and paste this code into your app, for example in `Application.onCreate()`:

```java
LASObject testObject = new LASObject("TestObject");
testObject.put("foo", "bar");
LASDataManager.saveInBackground(testObject);
```

Run your app. A new object of class `TestObject` will be sent to the LAS Cloud and saved. When you're ready, click the button below to test if your data was sent.