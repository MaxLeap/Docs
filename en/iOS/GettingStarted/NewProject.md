---
title: Quick Start | LAS

language_tabs:
  - objective_c
  - Swift

search: true
---

# Install the SDK

1. Download & unzip the Project

    Make sure you are using the latest version of Xcode (v5.0+) and targeting iOS 6.0 or higher.

    <a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/iOS/v1.5.0/LASStarterProject.zip">Download the blank Xcode project</a>

2. Add the SDK to your app

    Before continuing, select your LAS app from the menu at the right. These steps are for your "Test" app.</br>
    Open up the `AppDelegate.m` file and uncomment and edit the first line in `application:didFinishLaunchingWithOptions:` to be like so:
    
    ```objective_c
    [LAS setApplicationId:@"your_application_id" clientKey:@"your_client_key"];
    ```
3. Compile and run
    
    
# Test the SDK

First make sure to include our SDK libraries from your `ViewController.h` file:

```objective_c
#import <LAS/LAS.h>
```

Then copy and paste this code into your app, for example in the `viewDidLoad` method of `ViewController.m`.

```objective_c
LASObject *testObject = [LASObject objectWithClassName:@"TestObject"];
testObject[@"foo"] = @"bar";
[LASDataManager saveObjectInBackground:testObject block:nil];
```

Run your app. A new object of class `TestObject` will be sent to the LAS and saved. When you're ready, click the button below to test if your data was sent.