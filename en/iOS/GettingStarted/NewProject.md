# Install the SDK

1. Download & unzip the Template Project

	Make sure you are using the latest version of Xcode (5.0+) and targeting iOS 6.0 or higher.

    <a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/iOS/v1.5.0/LASStarterProject.zip">下载模板项目</a>

2. Config Project

Some configurations should be made before the operation:
	
	Open `AppDelegate.m` file in template project, and cancel annotations in `application:didFinishLaunchingWithOptions:` as shown below:
    
    ```objc
    [MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key"];
    ```
    
     Replace `your_application_id` and `your_client_id ` with the one of your MaxLeap app.
    
3. Then you can run it.
    
    
# Test Project Configuration

We can add following code in `application:didFinishLaunchingWithOptions:` in `appDelegate.m` to test if we can connect MaxLeap Services with the app:


```objc
#import <MaxLeap/MaxLeap.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key"];

// Create a piece of data
MLObject *testObject = [MLObject objectWithClassName:@"Person"];
testObject[@"foo"] = @"bar";
[MLDataManager saveObjectInBackground:testObject block:nil];
```

This code is used to create a piece of `Person` data. If there is no `Person` class in cloud, then it will create the class first and then insert data. 

Run you app and you can see the data just created in Dev Center -> Data.

![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)