---
title: Quick Start | LAS

language_tabs:
  - objc
  - swift

search: true
---

# Install the SDK

1. Download & unzip the SDK

		Make sure you are using the latest version of Xcode (5.0+) and targeting iOS 6.0 or higher.

		<a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/iOS/v1.5.0/LASAll-v1.5.0.zip">Download the SDK</a>

2. Add the SDK to your app

	Drag the LAS.framework you downloaded into your Xcode project folder target.</br>
	Make sure the "Copy items to destination's group folder" checkbox is checked.
	
	<p class="image-wrapper">
	![](/images/drag_sdk_to_project.png)

3. Add the dependencies

	Click on Targets → Your app name → and then the 'Build Phases' tab.</br>
	Expand 'Link Binary With Libraries' as shown.
	
	<p class="image-wrapper">
	![](/images/add_dependencies.png)
	
    Make sure "Enable Modules (C and Objective-C)" and "Link Frameworks Automatically" build settings are YES.
    
    <p class="image-wrapper">
    ![](/images/enable_modules.png)
    
	Click the + button in the bottom left of the 'Link Binary With Libraries' section and add the following libraries:
	
	MobileCoreServices.framework</br>
	CoreTelephony.framework</br>
	SystemConfiguration.framework</br>
	libsqlite3.dylib</br>

# Connect your app to LAS servers

Open up your `AppDelegate.m` file and add the following import to the top of the file:

```objc
#import <LAS/LAS.h>
```

Before continuing, select your LAS app from the menu at the right. These steps are for your "Test" app.

Then paste the following inside the `application:didFinishLaunchingWithOptions:` function:

```objc
[LAS setApplicationId:@"your_application_id" clientKey:@"your_client_id"];
```

Compile and run!


# Test the SDK

First make sure to include our SDK libraries from your .h file:

```objc
#import <LAS/LAS.h>
```

Then copy and paste this code into your app, for example in the `viewDidLoad` method (or inside another method that gets called when you run your app):

```objc
LASObject *testObject = [LASObject objectWithClassName:@"TestObject"];
testObject[@"foo"] = @"bar";
[LASDataManager saveObjectInBackground:testObject block:nil];
```

Run your app. A new object of class `TestObject` will be sent to the LAS servers and saved. When you're ready, click the button below to test if your data was sent.

When you finish all of these steps above, you should see new data that we just defined appearing in the Cloud Data tab of the *Dashboard*.
