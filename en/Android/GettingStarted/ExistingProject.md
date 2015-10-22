## Install the SDK

1. Download & unzip the SDK

   	<a class="download-sdk" href="https://github.com/MaxLeap/SDK-Android/releases" target="_blank">Download Android Template</a>

2.	Add the SDK to your project

Import the zip file's contents into your existing Android project by extracting it into your "libs" folder. If your project does not already have a "libs" folder, create one at the root of the project by right-clicking the Project and choosing "New" and then "Folder".

Android Studio

Adding following dependency in "build.gradle":

```gradle
dependencies {
    compile fileTree(dir: 'libs', include: 'MaxLeap-*.jar')
}
```

##	Config MaxLeap Project

1. Connect project to MaxLeap app

Call `MaxLeap.initialize` from the `onCreate` method of your Application class to set your Application ID and REST API Key:

```java
import android.app.Application;
import com.maxleap.MaxLeap;

public class MyApplication extends Application {
      @Override
      public void onCreate() {
          super.onCreate();
          MaxLeap.initialize(this, "{{appid}}", "{{restapikey}}");
      }
    }
```

2. Config Permission

Give app following permissions in AndroidManifest:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
 ```

Permission|Purpose|If Necessary
---|---|---
`ACCESS_NETWORK_STATE`|		Check the network access, 2G, 3G or WiFi| Necessary
`INTERNET`| 	Allow network access to send data to our server| Necessary
`READ_PHONE_STATE`| 	Check IMEI of device and identify user with unique IMEI | Optional
`ACCESS_WIFI_STATE`| 	Check mac of device and identify user with unique mac| Optional

3. Quick Test Project Configuration

We can add following code in onCreate() method in Application to test if the project is already registered to MaxLeap：

```java
import android.app.Application;
import com.maxleap.MaxLeap;
import com.maxleap.MLDataManager;
import com.maxleap.MLObject;

public class MyApplication extends Application {
   @Override
   public void onCreate() {
       super.onCreate();
       MaxLeap.initialize(this, "{{appid}}", "{{restkey}}");

       //Test Project Configuration:
       MLObject testObject = new MLObject("People");
       testObject.put("Name", "David Wang");
       MLDataManager.saveInBackground(testObject);
   }
}
```

This piece of data is trying to create a “class” － “People” in  Cloud Data and save a data to it. We can check "Dev Center" -> "Data" and find:


![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

It indicates that saving data to  Cloud Data in the app with client is completed.

## Next Step
At this point, you have completed the installation and configuration of MaxLeap SDK. Please check [iOS SDK Guide](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS) or [Android SDK Guide](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID) to find more details about MaxLeap.