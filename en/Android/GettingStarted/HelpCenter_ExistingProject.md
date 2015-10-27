##	Install the SDK

HelpCenter relies on MaxLeap Core SDK, please check if your project has installed MaxLeap Core SDK already before install and use HelpCenter SDK. You can check more details in [MaxLeap Core SDK installation Guide](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID).

1. Get SDK

<a class="download-sdk" href="https://github.com/MaxLeap/Demo-Support-Android" target="_blank">Download MaxLeap HelpCenter Android SDK</a>

2. Add SDK

Android Studio

1. 	Open Android Studio, click “File” >> "New.." >> "Import Module" and choose "MaxLeap HelpCenter" directory.
2. 	Open the Module that requires HelpCenter and add following dependencies in build.gradle:

	```gradle
	dependencies {
		compile project(':ML Helpcenter')
	}
	```

##	Connect project to MaxLeap app

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

##	Config Permission

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

##	Quick Test 

1. Test MaxLeap Core SDK

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
		MaxLeap.initialize(this, "{{appid}}", "{{restapikey}}");

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

2. Test MaxLeap HelpCenter SDK
 We can add following code in onCreate() method in Application to test if MaxLeap HelpCenter works in the project:

```java
MLHelpCenter.openFaqs(MainActivity.this);
```

Run it and you can see this in Andriod test device:

![imgSupportHome](../../../images/imgSupportHome.png)

Click the top right "Submit Feedback" button and fill feedback message:

![imgSupportAddMsg](../../../images/imgSupportAddMsg.png)

At last, click the top right "send" button and you can receive a message from MaxLeap:

![imgSupportConversation](../../../images/imgSupportConversation.png)

It indicates that MaxLeap has received your feedback message. Test succeeded.

## Next Step

At this point, you have completed the installation and configuration of HelpCenter SDK. Please check [HelpCenter SDK Guide](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_ZH) to find more details about MaxLeap.