# Marketing
##Introduction
###What is MaxLeap Marketing

Marketing is a promotion and message issuance service provided by MaxLeap. There are two marketing types for you to choose: Push Notification and In-app Message. You can send Push Notifications to a certain group of people and show specific messages to a segment with In-app Message. You can even set the Target Activity on user's click. The creation, settings and sending are all done in Console.

###Why is MaxLeap Marketing Necessary 
With data from Analytics and Segment provided by MaxLeap Users, you can make and implement marketing strategies with high efficiency. The advantages of MaxLeap Marketing can be summarized as follows: 

* **Improve Penetrance: **Issue marketing campaign at any time to improve the user engagement and penetrance
* **Ensure the user experience: **More targeted to send messages to certain Segment 
* **Dynamic Content Management: **The content of Push Notifications and In-app Messages can be modified and updated in real time in Console.

## In-app Message

Marketing function is off by defalut. You can enable it with `[MLMarketingManager enable]`:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"yout_client_key"];
	[MLMarketingManager enable];
}
```

Now the app can receive in-app messages, except receiving and counting push notifications.

## Push Notification
Push Notification helps you show messages to plenty of users. After you send the message, users can see it in status bar whether they open the app or not. You can customize message content in Console and send several properties (Key-Vaule) to clients. The application will determine the Target Activity according to the property after users tap on the push.

###Configuration

The first thing is to apply the Push Notification certificate.

You can enbale Push Notification in `appDelegate.m` with following code:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    [MaxLeap setApplicationId:@"5552f51660b2056aa87dd9e0" clientKey:@"c3JscE50TWNnVzg4SkZlUnFsc3E2QQ"];
    
    [self registerRemoteNotifications];
    
    [MLMarketingManager enable];
    // Count Click Amount of the Push
    [MLMarketingManager handlePushNotificationOpened:launchOptions];
    
    return YES;
}

- (void)registerRemoteNotifications {
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        UIUserNotificationSettings *pushsettings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeBadge|UIUserNotificationTypeSound|UIUserNotificationTypeAlert categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:pushsettings];
    } else {
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeSound|UIRemoteNotificationTypeAlert];
    }
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    // Send device token to MaxLeap Server in order to send push to this device
    [[MLInstallation currentInstallation] setDeviceTokenFromData:deviceToken];
    [[MLInstallation currentInstallation] saveInBackgroundWithBlock:nil];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
    [application registerForRemoteNotifications];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
    completionHandler(UIBackgroundFetchResultNoData);
}
```

### Count Click Rate of The Push

Add following code in `application:didFinishLaunchingWithOptions:` method：

	```
	[MLMarketingManager handlePushNotificationOpened:launchOptions];
	```

