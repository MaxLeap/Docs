# 即时通讯

## 简介

使用 MaxLeap 的即时通讯服务，可以轻松实现一个实时聊天应用，或者一个联机对战类的游戏。除聊天室外的聊天记录都保存在云端，离线消息会通过消息推送及时送达，推送的消息文本可以灵活定制。

## 安装

`MaxIMLib.framework` 依赖于 `SocketIOClientSwift.framework`，支持 iOS 8 及更新版本的 iOS 系统。
支持 Xcode 7 及更新版本。

1. 下载最新版 [MaxIMSDK](https://github.com/MaxLeap/SDK-iOS/releases)
2. 在 Xcode 中打开你的项目，导航到 Project -> Target -> General
3. 把下载好的 `MaxIMLib.framework` 和 `SocketIOClientSwift.framework` 拖到 **Embedded Binaries** 下面

## 登录

MaxIM 支持四种登录方式：

1. 使用一个用户 ID 直接建立连接
2. 使用 MaxLeap 账户系统验证登录
3. 使用手机号和短信验证码登录
4. 使用第三方平台认证信息登录

### 创建 `MLIMClient` 示例

```
// 客户端配置
MLIMClientConfiguration *configuration = [MLIMClientConfiguration 
defaultConfiguration];

// 必选配置
configuration.appId = @"Your_MaxLeap_ApplicationId";
configuration.clientKey = @"Your_MaxLeap_ClientKey";

// 断线重连设置
configuration.autoReconnect = YES;
configuration.reconnectAttempts = 3; // 重连次数
configuration.reconnectWait = 3; // 断线后重连等待时间

// 可选配置，如果不配置 installationId，将不会收到离线消息推送
configuration.installationId = [MLInstallation currentInstallation].installationId;

MLIMClient *client = [MLIMClient clientWithConfiguration:configuration];
```

### 使用 ID 直接登录

现在登录 Tom 这个 ID，使用该方式登录，无论 Tom 这个 ID 存不存在，都能登录成功。系统仅仅校验 AppId 与 ClientKey 是否匹配。实现如下：

```
// 登录，不需要密码
[client loginWithUserId:@"Tom" completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"登录成功");
    }
}];
```

### 使用 MaxLeap 账户系统验证登录

此登录方式会使用 MaxLeap 账户系统的用户名与密码校验，需用户名与密码相匹配才能成功登录。登录成功后会使用 MLUser 的 objectId 作为 IM 系统的用户 ID。

```
// 登录，需要用户名和密码
[client loginWithUsername:@"Tom" password:@"pwd" completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"登录成功, 用户 ID 为: %@", client.currentUser.uid);
    }
}];
```

### 使用手机号和短信验证码登录

此登录方式无需注册。但是，用户每次登录时，都需要填写手机号，然后请求一个短信验证码。

```
NSString *phoneNumber;
// 用户填写手机号，请求短信验证码
[MLUser requestLoginSmsCodeWithPhoneNumber:phoneNumber block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 验证码发送成功，...
    }
}];
//...
// 用户收到短信后填写验证码
NSString *smsCode;
// 登录
[[MLCDataManager sharedManager].client loginWithPhoneNumber:phoneNumber smsCode:smsCode completion:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

### 使用第三方平台授权数据登录

`[MLUser currentUser].oauthData` 需要 MaxLeap v2.0.9 以上版本支持。

```
NSDictionary *authData = [MLUser currentUser].oauthData;
[[MLCDataManager sharedManager].client loginWithThirdPartyOAuth:authData completion:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

## 暂时断开连接

应用进入后台一段时间后，可能需要暂时断开连接。手动断开连接(并非登出)代码如下：

```
[client pause];
```

假设用户只使用当前终端登录，客户端暂时断开连接后，用户会出于离线状态。离线状态下的消息会通过远程推送的方式送达，这需要客户端打开远程推送功能。详情请查阅 [离线消息推送](...) 一节。

用户切换回前台后需要手动连接。

```
[client resume];
```

## 登出（注销）

用户登出后，将不会再收到任何消息，包括离线消息推送。

```
[[MLCDataManager sharedManager].client logoutWithCompletion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"注销成功");
    } else {
        NSLog(@"注销失败, error: %@", error);
    }
}];
```

## 消息

在 `MaxIMLib` 中, `MLIMMessage` 代表一条消息。它其中字段的含义如下：

**`mediaType`**: 消息媒体类型，目前支持文本，图片，音频，视频四种类型
**`text`**: 文本消息内容，如果 `mediaType` 不是文本类型，该字段内容会被忽略
**`attachmentUrl`**: 非文本消息(如音频消息，图片消息)的附件地址，文本消息忽略该字段
**`sender`**: 发送方，表示谁发送过来的，`sender.type` 表示发送发类型，`sender.userId` 发送方的用户 ID, `sender.groupId` 如果消息来自群组，该字段表示该群组的 ID， `sender.roomId` 如果消息来自聊天室，该字段表示该群组的 ID
**`receiver`**: 接收方，跟 `sender` 有一样的结构
**`status`**: 消息状态，发送中，发送成功，发送失败等
**`sendTimestamp`**: 消息发送时间，距离1970年的秒数

## 单聊

### 好友管理
#### 加好友

```
[self.client.currentUser addFriendWithUser:@"friendUserId" completion:^(NSDictionary * _Nonnull result, NSError * _Nullable error) {
    // ...
}];
```

#### 删除好友

```
[self.client.currentUser deleteFriend:@"fid" completion:^(BOOL success, NSError * _Nullable error) {
    // ...
}];
```

#### 监听好友上下线事件

```
#pragma mark - MLIMClientDelegate

- (void)frriendDidOnline:(MLIMFriendInfo *)frriend {
	// ...
}

- (void)frriendDidOffline:(MLIMFriendInfo *)frriend {
	// ...
}
```

#### 获取所有好友信息

```
[self.client.currentUser fetchFriendsWithDetail:YES completion:^(BOOL success, NSError * _Nullable error) {
    // ...
}];
// 注：该方法第一个参数表示是否获取好友详细信息，如果为 YES 则拉取全部信息，否则只返回好友 ID
// 获取成功后，好友信息会保存在 user.friends 数组中
```

### 拉取单个好友详细数据

假如只知道好友的 ID，要拿好友详细信息，代码如下：

```
[self.client.currentUser getFriendInfo:@"fid" completion:^(MLIMFriendInfo * _Nonnull info, NSError * _Nullable error) {
    // ...
}];
```

### 发送消息

Tom 给 Jerry 发一条消息，假设 Jerry 的 ID 就是 Jerry，实现如下：

```
// 登录成功的状态下
// 创建一条文本消息
MLIMMessage *msg = [MLIMMessage messageWithText:@"Hi!"];
// 将文本消息发给 Jerry
[self.client sendMessage:msg toFriend:@"Jerry" completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"发送成功！")；
    }
}];
```

### 接收消息

让 Jerry 收到 Tom 的消息的实现如下：

```
- (void)jerryLogin {
	MLIMClientConfiguration *configuration = [MLIMClientConfiguration defaultConfiguration];
	configuration.appId = @"Your_MaxLeap_ApplicationId";
	configuration.clientKey = @"Your_MaxLeap_ClientKey";

	self.client = [MLIMClient clientWithConfiguration:configuration];
	self.client.delegate = self;
	[self.client loginWithUserId:@"Jerry" completion:^(BOOL succeeded, NSError * _Nullable error) {
		 // ...
    }];
}

#pragma mark - MLIMClientDelegate

- (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromFriend:(MLIMFriendInfo *)frriend {
	if ([frriend.uid isEqualToString:@"Tom"]) {
		// NSLog(@"Did receive Tom's message");
	}
}

```

### 获取历史消息

与好友的聊天记录会在云端保存 7 天

```
// 获取当前时间最新的十条历史消息（包括自己发的）
NSTimeInterval ts = [[NSDate date] timeIntervalSince1970];
[self.client.currentUser getLatestChatsWithFriend:@"friend_uid" beforeTimestamp:ts limit:10 block:^(NSArray<MLIMMessage *> * _Nullable messages, NSError * _Nullable error) {
    if (!error) {
        NSLog(@"lastest history messages: %@", messages);
    }
}];
```

## 群组聊天

### 获取所有已加入的群组

```
[self.client.currentUser fetchGroupsWithDetail:YES completion:^(BOOL success, NSError * _Nullable error) {
    // ...
}];
// 注：该方法第一个参数表示是否获取群组详细信息，如果为 YES 则拉取全部信息，否则只返回群组 ID
// 获取成功后，好友信息会保存在 user.groups 数组中
```

### 获取指定群组的信息

```
MLIMGroup *group = [MLIMGroup groupWithId:@"gid"];
[group fetchWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
// 获取到的值会自动填充到 group 对应的属性中
```

### 建立群组

```
NSString *owner = self.client.currentUser.uid;
// 创建群组，并把 Jerry 拉进群
[MLIMGroup createWithOwner:owner name:@"Tom's group" members:@[owner, @"Jerry"]  block:^(MLIMGroup * _Nonnull group, NSError * _Nonnull error) {
    if (group) {
        // 创建成功
    } else {
        // 创建失败
    }
}];
```

加入群组：

```
MLIMGroup *group = [MLIMGroup groupWithId:@"gid"];
[group addMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
		// 成功 ...
    }
}];
```

退出群组：

```
MLIMGroup *group = [MLIMGroup groupWithId:@"gid"];
[group removeMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 成功 ...
    }
}];
```

### 在群组中发送消息

```
MLIMMessage *message = [MLIMMessage messageWithText:@"Hi!"];
[self.client sendMessage:message toGroup:groupId completion:completionBlock];
```

### 接收群组消息

```
- (void)jerryLogin {
	MLIMClientConfiguration *configuration = [MLIMClientConfiguration defaultConfiguration];
	configuration.appId = @"Your_MaxLeap_ApplicationId";
	configuration.clientKey = @"Your_MaxLeap_ClientKey";

	self.client = [MLIMClient clientWithConfiguration:configuration];
	self.client.delegate = self;
	[self.client loginWithUserId:@"Jerry" completion:^(BOOL succeeded, NSError * _Nullable error) {
		 // ...
    }];
}

#pragma mark - MLIMClientDelegate

- (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromGroup:(MLIMGroup *)group {
	NSLog(@"Did receive group message：%@"， message);
}
```

### 获取群组聊天历史记录

群组聊天记录会在云端保存七天

```
// 获取当前时间最新的十条消息（包括自己发送的）
NSTimeInterval ts = [[NSDate date] timeIntervalSince1970];
[group getLatestMessagesBefore:ts limit:10 completion:^(NSArray<MLIMMessage *> * _Nullable messages, NSError * _Nullable error) {
    if (!error) {
        NSLog(@"lastest group messages: %@", messages);
    }
}];
```

### 解散群组

```
[group deleteWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

## 聊天室

聊天室消息不会存在云端

### 获取所有加入的聊天室

```
[self.client.currentUser fetchRoomsWithDetail:YES completion:^(BOOL success, NSError * _Nullable error) {
    // ...
}];
// 注：该方法第一个参数表示是否获取聊天室详细信息，如果为 YES 则拉取全部信息，否则只返回聊天室 ID
// 获取成功后，聊天室信息会保存在 user.rooms 数组中
```

### 获取指定群组的信息

```
MLIMRoom *room = [MLIMRoom roomWithId:@"gid"];
[room fetchWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
// 获取到的值会自动填充到 room 对应的属性中
```

### 建立聊天室

```
NSString *owner = self.client.currentUser.uid;
// 创建群组，并把 Jerry 拉进聊天室
[MLIMRoom createWithName:@"Tom's room" members:@[owner, @"Jerry"]  block:^(MLIMGroup * _Nonnull group, NSError * _Nonnull error) {
    if (group) {
        // 创建成功
    } else {
        // 创建失败
    }
}];
```

加入聊天室:

```
MLIMRoom *room = [MLIMRoom roomWithId:@"rid"];
[room addMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
		// 成功 ...
    }
}];
```

退出聊天室:

```
MLIMRoom *room = [MLIMRoom roomWithId:@"rid"];
[room removeMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 成功 ...
    }
}];
```

### 在聊天室中发送消息

```
MLIMMessage *message = [MLIMMessage messageWithText:@"Hi!"];
[self.client sendMessage:message toRoom:roomId completion:completionBlock];
```

### 接收聊天室消息

```
- (void)jerryLogin {
	MLIMClientConfiguration *configuration = [MLIMClientConfiguration defaultConfiguration];
	configuration.appId = @"Your_MaxLeap_ApplicationId";
	configuration.clientKey = @"Your_MaxLeap_ClientKey";

	self.client = [MLIMClient clientWithConfiguration:configuration];
	self.client.delegate = self;
	[self.client loginWithUserId:@"Jerry" completion:^(BOOL succeeded, NSError * _Nullable error) {
		 // ...
    }];
}

#pragma mark - MLIMClientDelegate

- (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromRoom:(MLIMRoom *)room {
	NSLog(@"Did receive room message：%@"， message);
}
```

### 解散聊天室

```
MLIMRoom *room = [MLIMRoom roomWithId:@"rid"];
[room deleteWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

## 系统消息

```
- (void)jerryLogin {
	MLIMClientConfiguration *configuration = [MLIMClientConfiguration defaultConfiguration];
	configuration.appId = @"Your_MaxLeap_ApplicationId";
	configuration.clientKey = @"Your_MaxLeap_ClientKey";

	self.client = [MLIMClient clientWithConfiguration:configuration];
	self.client.delegate = self;
	[self.client loginWithUserId:@"Jerry" completion:^(BOOL succeeded, NSError * _Nullable error) {
		 // ...
    }];
}

#pragma mark - MLIMClientDelegate

- (void)client:(MLIMClient *)client didReceiveSystemMessage:(MLIMMessage *)message {
	NSLog(@"Did receive room message：%@"， message);
}
```

系统消息也区分全体消息，群组消息，特定用户消息，可以使用 `message.receiver` 区分。


## 离线推送消息

当用户离线，并且没用注销的时候，如果收到好友或者群组消息，系统会尝试给该用户发送推送。为了使用户能正常接收推送消息，请客户端远程推送功能。

开启远程推送的流程如下：

### 集成 MaxLeap.framework

MaxIM 离线消息推送依赖于 MaxLeap 推送服务，所以需要集成 MaxLeap.framework，集成方法请查阅：[QuickStart - Core SDK](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS)

另外，在创建 MLIMCient 实例的时候需要传入当前的 installationId :

```

```
MLIMClientConfiguration *configuration = [MLIMClientConfiguration 
defaultConfiguration];
configuration.appId = @"Your_MaxLeap_ApplicationId";
configuration.clientKey = @"Your_MaxLeap_ClientKey";

// 需要配置 installationId 才能收到离线推送
configuration.installationId = [MLInstallation currentInstallation].installationId;

MLIMClient *client = [MLIMClient clientWithConfiguration:configuration];
```

```

### 配置

首先要申请并上传远程推送证书，详细步骤请参照：[iOS 推送证书设置指南](#营销-推送证书设置指南)。

在 `appDelegate.m` 中，您可以使用下面的代码开启远程推送

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    
    [MaxLeap setApplicationId:@"5552f51660b2056aa87dd9e0" clientKey:@"c3JscE50TWNnVzg4SkZlUnFsc3E2QQ" site:MLSiteCN];
    
    [self registerRemoteNotifications];
    
    [MLMarketingManager enable];
    // 统计推送点击事件
    [MLMarketingManager handlePushNotificationOpened:launchOptions];
    
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


## 推送证书设置指南

1. 生成推送证书，参照苹果官方文档《App Distribution Guide》的 [Creating a Universal Push Notification Client SSL Certificate](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html#//apple_ref/doc/uid/TP40012582-CH26-SW11) 小节。

2. 安装证书

	下载并双击证书，点击弹出框右下角的`添加`按钮，把证书导入到`钥匙串`中。
	
	在`钥匙串`中选择左边的 `login` 和 `My Certificates`，这时应该能在右边找到刚刚导入的证书。

3. 导出 .p12 文件

	**注意不要展开 private key**

	![](../../../images/ios_push_export_p12.png)
	
4. 将文件保存为 Personal Information Exchange (.p12) 格式。
	
	![](../../../images/ios_push_export_filename.png)
	
5. 上传证书
	
	在 [MaxLeap 管理平台：应用设置 - 推送通知](https://maxleap.cn/settings#notification) 上，选择对应的应用程序，上传之前获得的 .p12 文件。**这是集成 MaxLeap 推送的必要步骤。**
	
	**目前 MaxLeap 还只支持产品环境推送证书，我们稍后会支持沙盒环境。**
