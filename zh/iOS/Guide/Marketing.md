# 营销

## 简介

### 什么是LeapCloud Marketing服务

Marketing 服务是 LeapCloud 提供的营销和信息发布功能。目前提供两种 Marketing 形式：Push Notification和 In-App Message.您可以通过推送消息方式向指定人群推送消息，也可以通过 In-App Message，在应用内向有某种行为的用户显示特定内容。您还可以在消息中设置用户点击后的目标。消息的创建，设置和发送均在 Console 中完成。

### 为何需要LeapCloud Marketing服务

结合LeapCloud分析服务提供的分析数据，以及LeapCloud Users服务提供的Segment，您可以高效地制定营销策略，并且通过Marketing服务实施您的策略。LeapCloud Marketing服务的优势在于：


* **提高转化率：**随时向用户发布营销活动，维持用户活跃度并提高转化率
* **保障用户体验：**选择向指定Segment发送消息，更具有针对性
* **动态内容管理：**Push Notification和In-App Message中的内容均在Console中设置，用户所见内容可实时更新

## 远程推送

推送消息帮助您迅速地将消息展示给大量的用户。发送推送消息后，无论用户是否打开应用，都将在状态栏看见它。您可以在Console 中自定义发送消息的内容，并且传递若干自定义参数(键值对)至客户端。用户点击推送消息后，应用可以根据参数决定目标界面。

### 开启远程推送

首先要申请远程推送证书。

在 `appDelegate.m` 中，您可以使用下面的代码开启远程推送

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    [LeapCloud setApplicationId:@"your_application_id" clientKey:@"yout_client_key"];
    
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 80000
    if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
                                                        UIUserNotificationTypeBadge |
                                                        UIUserNotificationTypeSound);
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:userNotificationTypes
                                                                                 categories:nil];
        [application registerUserNotificationSettings:settings];
    } else
#endif
    {
        [application registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                         UIRemoteNotificationTypeAlert |
                                                         UIRemoteNotificationTypeSound)];
    }
    
    return YES;
}

// 把 deviceToken 保存到 LeapCloud 服务器, 以便服务器能向这台设备推送消息
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[LCInstallation currentInstallation] setDeviceTokenFromData:deviceToken];
    [LCDataManager saveObjectInBackground:[LCInstallation currentInstallation] block:nil];
}
```

### 统计推送点击率

1. 在 `application:didFinishLaunchingWithOptions:` 方法中加入以下代码：

	```
	[LCMarketingManager handlePushNotificationOpened:launchOptions];
	```

2. 在 `application:didReceiveRemoteNotification:` 或者 `application:didReceiveRemoteNotification:fetchCompletionHandler:` 代理方法中加入以下代码：

	```
	[LCMarketingManager handlePushNotificationOpened:userInfo];
	```

## 应用内消息

打开应用内消息接收功能。

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	[LeapCloud setApplicationId:@"your_application_id" clientKey:@"yout_client_key"];
	[LCMarketingManager enable];
}
```

此时，应用就会接收应用内消息。