
## Install the SDK

1. Download & unzip the Template Project

	Make sure you are using the latest version of Xcode (5.0+) and targeting iOS 6.0 or higher.

    <a class="download-sdk" href="https://github.com/MaxLeap/Demo-Support-iOS" target="_blank">Download Template Project</a>

2. Connect MaxLeap App

	Some configurations should be made before the operation:
	
	Open `AppDelegate.m` file in template project, and cancel annotations in `application:didFinishLaunchingWithOptions:` as shown below:
    
    ```objc
    [MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key"];
    [MLHelpCenter install];
    ```
    
    Replace `your_application_id` and `your_client_id ` with the one of your MaxLeap app.
    
3. Then you can run it.
    
    
## Test Project Configuration

1. Test the Connection to MaxLeap App

We can add following code in `application:didFinishLaunchingWithOptions:` in `appDelegate.m` to test if we can connect MaxLeap Services with the app:


```objc
#import <MaxLeap/MaxLeap.h>
#import <MLHelpCenter/MLHelpCenter.h>

- (BOOL)application:(UIApplication *)application 	didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
[MaxLeap setApplicationId:@"your_application_id" 	clientKey:@"your_client_key"];
[MLHelpCenter install];

// Create a piece of data
MLObject *testObject = [MLObject objectWithClassName:@"Person"];
testObject[@"foo"] = @"bar";
[MLDataManager saveObjectInBackground:testObject block:nil];
```

This code is used to create a piece of `Person` data. If there is no `Person` class in cloud, then it will create the class first and then insert data.

Run you app and you can see the data just created in Dev Center -> Data.

![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

2. Test if HelpCenter Module works well: 

Add following code in `viewDidAppear:` in `ViewController.m`:

```
[[MLHelpCenter sharedInstance] showFAQs:self];
```

Run the template project just configured, and you can see the following interface:

![ios_faq_view](../../../images/ios_faq_view.png)


The FAQ of a new app contains General, Billing and Privacy. If this interface shows these 3 sections, then the connection is working properly.

Click the top right "Feedback" button in FAQ page:

![ios_new_conversation_view](../../../images/ios_new_conversation_view.png)

Then fill the short description and title and click top right "Send" button. You may receive a auto response and it indicates that HelpCenter module is intergrated successfuly.

![ios_issue_message_view](../../../images/ios_issue_message_view.png)

You can see this feedback in Support -> App Issues -> New Issues in MaxLeap website.
