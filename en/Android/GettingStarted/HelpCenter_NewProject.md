#	Install the SDK

HelpCenter relies on Leap Cloud Core SDK, please check if your project has installed Leap Cloud Core SDK already before install and use HelpCenter SDK. You can check more details in [Leap Cloud Core SDK Guide](LC_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID).

1.	Get project template:

	<a class="download-sdk" href="...">Download Leap Cloud HelpCenter project template</a>
	
2.	Open project template
	
	Android Studio 
	
	1. 	Open Android Studio and click “Import project”
	2. 	Enter template root directory and choose “build.gradle”
	3. 	Click Next Step by default until done
	
	Eclipse
		
	1.	Open Eclipse and click "File" -> "Import..." 
	2. 	Choose "General"-> "Existing Projects into Workspace"
	3. 	Select “Select root directory”, enter workspace directory and choose LCStarterProject in project list.

#	Connect project to Leap Cloud app
	
	Call `LASConfig.initialize` from the `onCreate` method of your Application class to set your Application ID and REST API Key:
	
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
	
#	Config Permission

	Give app following permissions in AndroidManifest:

		
	```java
		<uses-permission android:name="android.permission.READ_PHONE_STATE" />
		<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
		<uses-permission android:name="android.permission.INTERNET" />
	```
		
		Permission|Purpose|If Necessary
	---|---|---
	`ACCESS_NETWORK_STATE`|		Check the network access, 2G, 3G or WiFi| Necessary
	`READ_PHONE_STATE`| 	Check IMEI of device and identify user with unique IMEI and mac| Necessary
	`INTERNET`| 	Allow network access to send data to our server| Necessary
	
#	Quick Test

1. Test Leap Cloud Core SDK

	We can add following code in onCreate() method in Application to test if the project is already registered to Leap Cloud：
	
	```java
	import android.app.Application;
	import as.leap.LCConfig;
	import as.leap.LCDataManager;
	import as.leap.LCObject;
	
	public class MyApplication extends Application {
		@Override
		public void onCreate() {
			super.onCreate();
			LCConfig.initialize(this, "{{appid}}", "{{restapikey}}");
			
			//Test Project Configuration：
			LCObject testObject = new LCObject("People");
			testObject.put("Name", "David Wang");
			LCDataManager.saveInBackground(testObject);
		}
	}
	```
	
This piece of data is trying to create a “class” － “People” in Cloud Data and save a data to it. We can check "Dev Center" -> "Data" and find:
	
	![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)
	
	It indicates that saving data to Cloud Data in the app with client is completed, so does the installation and configuration of Leap Cloud SDK.

2. Test Leap Cloud HelpCenter SDK
	 We can add following code in onCreate() method in Application to test if Leap Cloud HelpCenter works in the project:
	
	```java
	LCHelpCenter.openFaqs(MainActivity.this);
	```
	
	Run it and you can see this in Andriod test device:
	
	![imgSupportHome](../../../images/imgSupportHome.png)
	
	Click the top right "Submit Feedback" button and fill feedback message:
	
	![imgSupportAddMsg](../../../images/imgSupportAddMsg.png)
	
	At last, click the top right "send" button and you can receive a message from Leap Cloud: 
	
	![imgSupportConversation](../../../images/imgSupportConversation.png)
	
	It indicates that Leap Cloud has received your feedback message. Test succeeded.

#Next Step

At this point, you have completed the installation and configuration of HelpCenter SDK. Please check [HelpCenter SDK Guide](LC_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#SUPPORT_ZH) to find more details about Leap Cloud.