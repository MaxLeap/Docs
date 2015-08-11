# Quick Start

##	Install SDK

####	Qucik Start with Leap Cloud SDK Using Project Template

#####	1.	Get Project Template

[Download Android Project Template](https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/Android/v0.6/LASStarterProject.zip)，and decompress it to your Workspace. Leap Cloud 
	
####	2.	Open Project Template

#####	Android Studio 

	1. 	Open Android Studio，and click “Import project” 
	2. 	Enter the root directory of project template, and select “build.gradle” 
	3. 	Select next steps according to the default settings, untill it's done.

#####	Eclipse
	
	1.	Open Eclipse，and click "File" -> "Import.."  	2. 	Select "General"-> "Existing Projects into Workspace" 	3. 	Check “Select root directory”，enter workspace directory and select LCStarterProject in project list. 
	
##	Config Leap Cloud Project

###	Connect Project with Leap Cloud App 
	
	Invoke `LCConfig.initialize` in onCreate() method of Application to set your app's Application ID and REST API Key：
	
	```java
	import android.app.Application;
	import as.leap.LCConfig;

	public class MyApplication extends Application {
	    @Override
	    public void onCreate() {
	        super.onCreate();
	        LCConfig.initialize(this, "{{appid}}", "{{restapikey}}");
	    }
	}
	```
	
###	Permission Configuration

	Give following permissions to the app in AndroidManifest: 
	
	```java
	<uses-permission android:name="android.permission.READ_PHONE_STATE" />
   	<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   	<uses-permission android:name="android.permission.INTERNET" />
    ```
	
	Permission|Usage|If it's neccessary
	---|---|---
	`ACCESS_NETWORK_STATE`|		Allow network conenction to detect 2G, 3G or WI-Fi on user's device.| Neccessary
	`READ_PHONE_STATE`| 	Get user's device IMEI and identify user with the only IMEI and mac. | Neccessary
	`INTERNET`| 	Allow network conenction to send data to our server| Neccessary
	
##	Quick Test Project Configuration
In order to test whether the project is connected to Leap Cloud app and its cloud service, you can add following code to onCreate() method of Application:

```java
import android.app.Application;
import as.leap.LCConfig;
import as.leap.LCDataManager;
import as.leap.LCObject;

public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        LCConfig.initialize(this, "{{appid}}", "{{restkey}}");
        
        //Test Project Configuration：
        LCObject testObject = new LCObject("People");
        testObject.put("Name", "David Wang");
        LCDataManager.saveInBackground(testObject);
    }
}
```

The test code is tryig to create a “CLASS” － “People” in Cloud Data and save a piece of code. We will spot this in Dev Center -> CLoud Storage:

![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

It indicates that the data storage in Cloud Data is successfully completed with client.

Congratulations on the Leap Cloud SDK installtion and configuration. Please click [SDK Tutorial](LC_DOCS_LINK_PLACEHOLDER_SDK_TUTORIALS_IOS) to check more detailed introduction and usage of LC, and start your Leap Cloud Service now.