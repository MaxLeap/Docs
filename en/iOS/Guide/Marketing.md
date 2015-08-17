---
titile: Marketing
---

# Marketing

If you haven't installed the SDK yet, please [head over to the Push QuickStart][ios quick start] to get our SDK up and running.

## Introduction

Push Notifications are a great way to keep your users engaged and informed about your app. You can reach your entire user base quickly and effectively. This guide will help you through the setup process and the general usage of LAS to send push notifications.

## Setting Up Push

If you want to start using push, start by completing the [iOS Push tutorial](LC_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_EN) to learn how to configure your app. Come back to this guide afterwards to learn more about the push features offered by LAS.

## Installations

Every LAS application installed on a device has an associated `Installation` object. The `Installation` object is where you store all the data needed to target push notifications. For example, in a baseball app, you could store the teams a user is interested in to send updates about their performance.

In iOS, `Installation` objects are available through the `LASInstallation` class, a subclass of LASObject. It uses the [same API](LC_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#CLOUD_DATA_EN) for storing and retrieving data. To access the current `Installation` object from your iOS app, use the `+[LASInstallation currentInstallation]` method.

First, make your app register for remote notifications by adding the following in your `application:didFinishLaunchingWithOptions:` method (if you haven't already):

```
- (void)registerRemoteNotifications {

    // For iOS 8:
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) 
    {
        UIUserNotificationSettings *pushsettings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeBadge|UIUserNotificationTypeSound|UIUserNotificationTypeAlert categories:nil];
        [LASPushManager enablePushWithSettings:pushsettings];
    } 
    // Before iOS 8:
    else {
        [LASPushManager enablePushTypes:UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeSound|UIRemoteNotificationTypeAlert];
    }
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    ...
    // Register for remote notifications
    [self registerRemoteNotifications];
    ...
}
```

LAS SDK will handle method `-application:didRegisterForRemoteNotificationsWithDeviceToken:` and save deviceToken to LAS server automatically. Then, you can send push to this device.

While it is possible to modify a `LASInstallation` just like you would a `LASObject`, there are several special fields that help manage and target devices.

- **`badge`**: The current value of the icon badge for iOS apps. Changing this value on the `LASInstallation` will update the badge value on the app icon. Changes should be saved to the server so that they will be used for future badge-increment push notifications.
- **`channels`**: An array of the channels to which a device is currently subscribed.
- **`timeZone`**: The current time zone where the target device is located. This value is synchronized every time an `Installation` object is saved from the device *(readonly)*.
- **`deviceType`**: The type of device, "ios", "android", "winrt", "winphone", or "dotnet"*(readonly)*.
- **`pushType`**: This field is reserved for directing LAS to the push delivery network to be used. If the device is registered to receive pushes via GCM, this field will be marked "gcm". If this device is not using GCM, and is using LAS's push notification service, it will be blank *(readonly)*.
- **`installationId`**: Unique Id for the device used by LAS *(readonly)*.
- **`deviceToken`**: The Apple generated token used for iOS devices *(readonly)*.
- **`appName`**: The display name of the client application to which this installation belongs *(readonly)*.
- **`appVersion`**: The version string of the client application to which this installation belongs *(readonly)*.
- **`sdkVersion`**: The version of the LAS SDK which this installation uses *(readonly)*.
- **`appIdentifier`**: A unique identifier for this installation's client application. In iOS, this is the Bundle Identifier *(readonly)*.

## Receiving Pushes

It is possible to send arbitrary data along with your notification message. We can use this data to modify the behavior of your app when a user opens a notification. For example, upon opening a notification saying that a friend commented on a user's picture, it would be nice to display this picture.

Due to the package size restrictions imposed by Apple, you need to be careful in managing the amount of extra data sent, since it will cut down on the maximum size of your message. For this reason, it is recommended that you keep your extra keys and values as small as possible.

### Responding to the Payload

When an app is opened from a notification, the data is made available in the `application:didFinishLaunchingWithOptions:` methods through the `launchOptions` dictionary.

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  . . .
  // Extract the notification data
  NSDictionary *notificationPayload = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
 
  // Create a pointer to the Photo object
  NSString *photoId = [notificationPayload objectForKey:@"p"];
  LASObject *targetPhoto = [LASObject objectWithoutDataWithClassName:@"Photo"
                                                          objectId:photoId];
 
  // Fetch photo object
  [LASDataManager fetchDataOfObjectIfNeededInBackground:targetPhoto block:^(LASObject *object, NSError *error) {
    // Show photo view controller
    if (!error && [LASUser currentUser]) {
      PhotoVC *viewController = [[PhotoVC alloc] initWithPhoto:object];
      [self.navController pushViewController:viewController animated:YES];
    }
  }];
}
```

If your app is already running when the notification is received, the data is made available in the `application:didReceiveRemoteNotification:fetchCompletionHandler:` method through the `userInfo` dictionary.

```
- (void)application:(UIApplication *)application
      didReceiveRemoteNotification:(NSDictionary *)userInfo 
            fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))handler {
  // Create empty photo object
  NSString *photoId = [userInfo objectForKey:@"p"];
  LASObject *targetPhoto = [LASObject objectWithoutDataWithClassName:@"Photo"
                                                          objectId:photoId];
 
  // Fetch photo object
  [LASDataManager fetchDataOfObjectIfNeededInBackground:targetPhoto block:^(LASObject *object, NSError *error) {
    // Show photo view controller
    if (error) {
      handler(UIBackgroundFetchResultFailed);
    } else if ([LASUser currentUser]) {
      PhotoVC *viewController = [[PhotoVC alloc] initWithPhoto:object];
      [self.navController pushViewController:viewController animated:YES];
      handler(UIBackgroundFetchResultNewData);
    } else {
      handler(UIBackgroundModeNoData);
    }
  }];
}
```

You can read more about handling push notifications in Apple's [Local and Push Notification Programming Guide](http://developer.apple.com/library/ios/#documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/IPhoneOSClientImp/IPhoneOSClientImp.html#//apple_ref/doc/uid/TP40008194-CH103-SW1).

### Clearing the Badge

A good time to clear your app's badge is usually when your app is opened. Setting the badge property on the current installation will update the application icon badge number and ensure that the latest badge value will be persisted to the server on the next save. All you need to do is:

```
- (void)applicationDidBecomeActive:(UIApplication *)application {
  LASInstallation *currentInstallation = [LASInstallation currentInstallation];
  if (currentInstallation.badge != 0) {
    currentInstallation.badge = 0;
    [LASDataManager saveObjectInBackground:currentInstallation block:nil];
  }
  // ...
}
```

The [UIApplicationDelegate documentation](http://developer.apple.com/library/ios/#DOCUMENTATION/UIKit/Reference/UIApplicationDelegate_Protocol/Reference/Reference.html) contains more information on hooks into an app’s life cycle; the ones which are most relevant for resetting the badge count are `applicationDidBecomeActive:`, `application:didFinishLaunchingWithOptions:`, and `application:didReceiveRemoteNotification:`.

## Troubleshooting

Setting up Push Notifications is often a source of frustration for developers. The process is complicated and invites problems to happen along the way. If you run into issues, try some of these troubleshooting tips.

- Make sure you are using the correct Bundle Identifier in the `Info.plist` file (as described in step 4.1 of the [iOS Push Notifications tutorial](LC_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#MARKETING_EN), titled, "Configuring a Push Enabled iOS Application."
- Make sure you set the correct provisioning profile in Project > Build Settings (as described in step 4.3 of the iOS Push Notifications tutorial.
- Clean your project and restart Xcode.
- Try regenerating the provisioning profile by navigating to [Certificates, Identifiers & Profiles](https://developer.apple.com/account/overview.action), changing the App ID set on the provisioning profile, and changing it back. You will need to reinstall the profile as described in step two of the tutorial (Creating the Provisioning Profile) and set it in your Project's Build Settings as described in step 4 ( Configuring a Push Enabled iOS Application).
- Open the Xcode Organizer and delete all expired and unused provisioning profiles from both your computer and your iOS device.
- If everything compiles and runs with no errors, but you are still not receiving pushes, make sure that your app has been given permission to receive notifications. You can verify this in your iOS device's `Settings > Notification > YourAppName`.
- If your app has been granted permission to receive push notifications, make sure that you are code signing your app with the correct provisioning profile. If you have uploaded a Development Push Notification Certificate to LAS, you will only receive push notifications if you built your app with a Development Provisioning Profile. If you have uploaded a Production Push Notification Certificate, you should sign your app with a Distribution Provisioning Profile. Ad Hoc and App Store Distribution Provisioning Profiles should both work when your app is configured with a Production Push Notification Certificate.
- When enabling push notifications for an existing App ID in the Apple iOS Provisioning Portal, make sure to regenerate the provisioning profile, then add the updated profile to the Xcode Organizer.
- Distribution push notifications need to be enabled prior to submitting an app to the App Store. Make sure you have followed Section 7, Preparing for the App Store, prior to submitting your app. If you skipped any of these steps, you might need to submit a new binary to the App Store.
- Double check that your app can receive distribution push notifications when signed with an Ad Hoc profile. This configuration is the closest you can get to an App Store provisioned app.
- Check the number of recipients in your leap.as push console. Does it match the expected number of recipients? Your push might be targeted incorrectly.
- If your app has been released for a while, it's possible for the recipient estimate on the push composer page to be higher than the pushes sent value on the push results page. The push composer estimate is generated via running your push segment query over your app's installation table. We do not automatically delete installation objects when the users uninstall your app. When we try to send a push, we detect uninstalled installations and do not include them in the pushes sent value on the results page.


[ios quick start]: ../../quickstart/ios/core/existing.html
[tutorial_img_link]: /images/tutorial_link.png
[tutorial_link]: ../../ios_push_tutorial.html
[ios guide #objects]: ../../docs/cloudData/ios.html#Objects
[ios guide #query]: ../../docs/cloudData/ios.html#Queries
