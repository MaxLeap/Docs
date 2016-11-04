# 推送营销

## 简介

### 什么是 MaxLeap 推送营销服务

推送营销服务是 MaxLeap 提供的营销和信息发布功能。目前提供两种消息模式：推送消息 和 应用内消息。你可以通过推送消息方式向指定人群推送消息，也可以通过应用内消息，在应用内向有某种行为的用户显示特定内容。你还可以在消息中设置用户点击后的目标 Activity。消息的创建，设置和发送均在Console中完成。

## 准备

> #### 推送营销功能集成在 `MaxLeap.framework` 中，如果你尚未安装，请先查阅[SDK 集成小节](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SDK_Install)，安装 SDK 并使之在 Xcode 中运行。
你还可以查看我们的 [API 参考](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS)，了解有关我们 SDK 的更多详细信息。

**注意**：我们支持 iOS 7.0 及以上版本。

## 应用内消息

默认情况下，推送营销功能处于关闭状态，不会接收消息。启用这个功能很简单，只需要 `[MLMarketingManager enable]` 一行代码，如下：

```objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"yout_client_key"];
	[MLMarketingManager enable];
}
```

此时，应用就会接收应用内消息，但是还不能接收和统计远程推送。

## 推送消息

推送消息帮助你迅速地将消息展示给大量的用户。发送推送消息后，无论用户是否打开应用，都将在状态栏看见它。你可以在Console中自定义发送消息的内容，并且传递若干参数(键值对)至客户端。用户点击推送消息后，应用会根据参数决定目标界面。

### 配置

首先要申请并上传远程推送证书，详细步骤请参照：[iOS 推送证书设置指南](#营销-推送证书设置指南)。

在 `appDelegate.m` 中，你可以使用下面的代码开启远程推送

```objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.

    [MaxLeap setApplicationId:@"5552f51660b2056aa87dd9e0" clientKey:@"c3JscE50TWNnVzg4SkZlUnFsc3E2QQ" site:MLSiteCN];

    [self registerRemoteNotifications];

    // 开启推送营销功能，默认关闭
    [MLMarketingManager enable];
    
    NSDictionary *aps = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
    if (aps) {
        NSLog(@"app was opened by remote notification: %@", aps);
        
        // 统计推送点击事件
        // 注意防止重复统计
        if (NO == [self respondsToSelector:@selector(application:didReceiveRemoteNotification:fetchCompletionHandler:)]) {
            [MLMarketingManager handlePushNotificationOpened:launchOptions];
        }
    }

    return YES;
}

- (void)registerRemoteNotifications {
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        UIUserNotificationSettings *pushsettings = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeBadge|UIUserNotificationTypeSound|UIUserNotificationTypeAlert categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:pushsettings];
    } else {
//#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_8_0
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeSound|UIRemoteNotificationTypeAlert];
//#endif
    }
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    // 将 device token 保存到 MaxLeap 服务器，以便服务器向本设备发送远程推送
    // 请解除注释将下面几行代码
//#if DEBUG
    [[MLInstallation currentInstallation] setDeviceTokenFromData:deviceToken forSandbox:YES];
//#else
    [[MLInstallation currentInstallation] setDeviceTokenFromData:deviceToken forSandbox:NO];
//#endif
    [[MLInstallation currentInstallation] saveInBackgroundWithBlock:nil];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
    [application registerForRemoteNotifications];
}


// 下面两个代理方法实现其中一个即可
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    // 统计推送点击事件
    [MLMarketingManager handlePushNotificationOpened:userInfo];
}

// 实现这个代理方法以后，不需要在 didFinishLaunchingWithOptions 中统计推送点击事件
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    
    // 统计推送点击事件
    [MLMarketingManager handlePushNotificationOpened:userInfo];
    completionHandler(UIBackgroundFetchResultNoData);
}
```

### 统计推送点击率

收到远程推送时使用以下代码推送推送点击事件：

	```objc
	[MLMarketingManager handlePushNotificationOpened:notificationPayload];
	```

### 设置 Badge

badge 是 iOS 用来标记应用程序未读消息(通知)的一个数字，出现在应用图标右上角。MaxLeap 支持保存 badge 值到服务器，然后由后台来管理每个用户推送的 badge 值。

>####  SDK 初始化时，会自动将应用实际 badge 值（[UIApplication sharedApplication].applicationIconBadgeNumber）上传到 MaxLeap 服务器。
>####  在后台发送推送消息时，后台会自动把每个 installation.badge 加 1.

#### 上传 badge 值

```objc
[MLInstallation currentInstallation].badge = 5;
[[MLInstallation currentInstallation] saveInBackgroundWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 上传成功
    } else {
        // 上传失败
    }
}];
```

**注意：设置 badge 值操作并不会更改应用图标实际 badge 值，本地仍然需要调用 `-[UIApplication setApplicationIconBadgeNumber:]` 方法。**

## 推送证书设置指南

1. 生成推送证书，参照苹果官方文档《App Distribution Guide》的 [Creating a Universal Push Notification Client SSL Certificate](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW11) 小节。

2. 安装证书

	下载并双击证书，点击弹出框右下角的`添加`按钮，把证书导入到`钥匙串`中。
	
	在`钥匙串`中选择左边上半部分的 `登陆` 和下半部分的 `我的证书`，这时应该能在右边找到刚刚导入的证书。

3. 导出 .p12 文件

	**注意不要展开 private key**

	![](../../../images/ios_push_export_p12.png)
	
4. 将文件保存为 Personal Information Exchange (.p12) 格式。
	
	![](../../../images/ios_push_export_filename.png)
	
5. 上传证书
	
	在 [MaxLeap 管理平台：应用设置 - 推送通知](https://maxleap.cn/settings#notification) 上，选择对应的应用程序，上传之前获得的 .p12 文件。**这是集成 MaxLeap 推送的必要步骤。**
