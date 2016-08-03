# 即时通讯

## 简介

使用 MaxLeap 的即时通讯服务，简称：MaxIM，可以轻松实现一个实时聊天应用，或者一个联机对战类的游戏。除聊天室外的聊天记录都保存在云端，离线消息会通过消息推送及时送达，推送的消息文本可以灵活定制。

## 安装

> #### `MaxIMLib.framework` 依赖于 `SocketIOClientSwift.framework`，支持 iOS 8 及更新版本的 iOS 系统。

需要 Xcode 7 或者更新版本。

1. 下载最新版 [MaxIMSDK (maxleap-im-ios-*.zip)](https://github.com/MaxLeap/SDK-iOS/releases)
2. 在 Xcode 中打开你的项目，导航到 Project -> Target -> General
3. 把下载好的 `MaxIMLibDynamic.framework` 和 `SocketIOClientSwift.framework` 拖到 **Embedded Binaries** 下面
4. **重要：**导航到 Project -> Target -> Build Settings 找到 Embedded Content Contains Swift Code，并设置为 YES。
5. **重要：**导航到 Project -> Target -> Build Phases，点击左上角的 `+` 号，选择 `New Run Script Phase`，点击刚刚添加的 `Run Script` 前面的三角符号，展开它，把[这段脚本(strip-frameworks)](https://raw.githubusercontent.com/realm/realm-cocoa/d59c86f11525f346c8e8db277fdbf2d9ff990d98/scripts/strip-frameworks.sh)拷贝到代码区域中。

**第四步和第五步很重要，不执行可能导致应用无法上传到 iTunes Connect。**

**为了方便模拟器调试，我们把支持 i386 和 x86_64 的代码也合并到 MaxIMLibDynamic.framework 里面，提交应用时应该去掉这些代码。但是 Xcode 在打包时会把整个动态库原封拷贝到应用程序包中（[详情戳这里](https://forums.developer.apple.com/thread/21496)），在上传到 iTunes Connect 的时候就会出错。strip-frameworks 这个脚本的作用就是去掉多余的代码。**

**如果需要接受离线推送消息，还需要集成 `MaxLeap.framework`，集成方法请查阅：[SDK 集成小节](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SDK_Install)。另外，在创建 MLIMCient 实例的时候需要传入当前的 installationId。**

## 初始化 IM 客户端，创建 `MLIMClient` 实例

```
// 客户端配置
MLIMClientConfiguration *configuration = [MLIMClientConfiguration 
defaultConfiguration];

// 必选配置
configuration.appId = @"Your_MaxLeap_ApplicationId";
configuration.clientKey = @"Your_MaxLeap_ClientKey";

// 断线重连设置
configuration.autoReconnect = YES;
configuration.reconnectAttempts = 3; // 自动重连次数
configuration.reconnectWait = 30; // 断线后重连等待时间，单位：秒

// 可选配置，如果不配置 installationId，将不会收到离线消息推送
configuration.installationId = [MLInstallation currentInstallation].installationId;

MLIMClient *client = [MLIMClient clientWithConfiguration:configuration];
```

## 登录状态管理

### 登录

MaxIM 支持多种登录方式，还支持非 MaxLeap 账号系统。

#### 登录方式

使用已有账号系统

1. 使用一个用户 ID 直接建立连接登录

使用 MaxLeap 账号系统

1. 使用用户名和密码验证登录
2. 使用手机号和短信验证码登录
3. 使用第三方平台认证信息登录

#### 使用一个用户 ID 直接建立连接登录

用户 ID 需匹配正则表达式 `[a-zA-Z0-9_\-]+`。

现在登录 Tom 这个 ID，如果 Tom 这个 ID 不存在，系统会创建一个。实现如下：

```
// 登录，不需要密码
[client loginWithUserId:@"Tom" completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"登录成功");
    }
}];
```

#### 使用用户名和密码验证登录

此登录方式会使用 MaxLeap 账户系统的用户名与密码校验，需用户名与密码相匹配才能成功登录。登录成功后会使用 MLUser 的 objectId 作为 IM 系统的用户 ID。

```
// 登录，需要用户名和密码
[client loginWithUsername:@"Tom" password:@"pwd" completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"登录成功, 用户 ID 为: %@", client.currentUser.uid);
    }
}];
```

#### 使用手机号和短信验证码登录

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
[client loginWithPhoneNumber:phoneNumber smsCode:smsCode completion:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

#### 使用第三方平台授权数据登录

`[MLUser currentUser].oauthData` 需要 MaxLeap v2.0.9 以上版本支持。

```
#import <MaxLeap/MLUser.h>

NSDictionary *authData = [MLUser currentUser].oauthData;
[client loginWithThirdPartyOAuth:authData completion:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

### 断开连接(不是登出)

应用进入后台一段时间后，可能需要暂时断开连接。手动断开连接(并非登出)代码如下：

```
[client pause];
```

假设用户现在只使用当前终端登录，客户端暂时断开连接后，用户会出于离线状态。离线状态下的消息会通过远程推送的方式送达，这需要客户端打开远程推送功能。详情请查阅 [离线消息推送](#offline_message_push) 一节。

### 重新连接

用户切换回前台后需要手动连接。

```
[client resume];
```

### 登出（注销）

用户登出后，将不会再收到任何消息，包括[离线推送消息](#offline_message_push)。

```
[client logoutWithCompletion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        NSLog(@"注销成功");
    } else {
        NSLog(@"注销失败, error: %@", error);
    }
}];
```

## 好友管理

### 加好友

使用此接口添加对方为好友，无需经过对方的同意，自己也会出现在对方好友列表中。

```
[client.currentUser addFriendWithUser:@"friendUserId" completion:^(NSDictionary * _Nonnull result, NSError * _Nullable error) {
    // ...
}];
```

### 删除好友

```
[client.currentUser deleteFriend:@"friendUserId" completion:^(BOOL success, NSError * _Nullable error) {
    // ...
}];
```

### 监听好友上下线事件

1. 实现代理 `MLIMClientDelegate` 接口：

	```
	#pragma mark - MLIMClientDelegate
	
	- (void)client:(MLIMClient *)client friendDidOnline:(MLIMFriendInfo *)aFriend {
		// ...
	}
	
	- (void)client:(MLIMClient *)client friendDidOffline:(MLIMFriendInfo *)aFriend {
		// ...
	}
	```

2. 好友上下线的时候，都会发布通知，通过监听通知实现：
	
	```
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didOnline:) name:MLIMFriendOnlineNotification object:nil];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didOffline:) name:MLIMFriendOfflineNotification object:nil];
	
	- (void)didOnline:(NSNotification *)notification {
		NSString *userId = notification.userInfo[@"id"];
		// ...
	}
	
	- (void)didOffline:(NSNotification *)notification {
	    NSString *userId = notification.userInfo[@"id"];
	    // ...
	}
	```

3. 好友上下线的时候，`MLIMFriendInfo` 的 `online` 属性会跟着改变

### 获取所有好友信息

```
[client.currentUser fetchFriendsWithDetail:YES completion:^(BOOL success, NSError * _Nullable error) {
	NSLog(@"friends: %@", client.currentUser.friends);
    // ...
}];
// 注：该方法第一个参数表示是否获取好友详细信息，如果为 YES 则拉取全部信息，否则只返回好友 ID
// 获取成功后，好友信息会保存在 user.friends 数组中
```

### 拉取单个好友详细数据

假如只知道好友的 ID，要拿好友详细信息，代码如下：

```
[client.currentUser getFriendInfo:@"fid" completion:^(MLIMFriendInfo * _Nonnull info, NSError * _Nullable error) {
    // ...
}];
```

## 群组管理

### 建立群组

```
NSString *owner = self.client.currentUser.uid;
// 创建群组，并把 Jerry 拉进群
[MLIMGroup createWithOwner:owner name:@"Tom's group" members:@[owner, @"Jerry"]  block:^(MLIMGroup * _Nonnull group, NSError * _Nonnull error) {
    if (group) {
        // 创建成功
    } else {
        // 创建失败，检查 error 查看失败原因
    }
}];
```

### 加入群组：

```
MLIMGroup *group = [MLIMGroup groupWithId:@"gid"];
[group addMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
		// 成功 ...
    }
}];
```

### 获取所有已加入的群组

```
// 设置是否获取群组详细信息，如果为 YES 则拉取全部信息，否则只返回群组 ID
// 获取成功后，好友信息会保存在 user.groups 数组中
BOOL getGroupDetail = YES;
[client.currentUser fetchGroupsWithDetail:getGroupDetail completion:^(BOOL success, NSError * _Nullable error) {
    if (success) {
        NSLog(@"groups: %@", client.currentUser.groups);
    }
    // ...
}];
```

### 获取指定群组的信息

```
MLIMGroup *group = [MLIMGroup groupWithId:@"gid"];
[group fetchWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    NSLog(@"group: %@", group);
    // 查看日志，看看 group 中多了什么？
    // ...
}];
// 获取到的值会自动填充到 group 对应的属性中
```

### 退出群组：

```
MLIMGroup *group = [MLIMGroup groupWithId:@"gid"];
[group removeMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 成功 ...
    }
}];
```

### 解散群组

```
[group deleteWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

## 聊天室管理

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

### 加入聊天室:

```
MLIMRoom *room = [MLIMRoom roomWithId:@"rid"];
[room addMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
		// 成功 ...
    }
}];
```

### 获取所有加入的聊天室

```
[client.currentUser fetchRoomsWithDetail:YES completion:^(BOOL success, NSError * _Nullable error) {
	NSLog(@"rooms: %@", client.currentUser.rooms);
    // ...
}];
// 注：该方法第一个参数表示是否获取聊天室详细信息，如果为 YES 则拉取全部信息，否则只返回聊天室 ID
// 获取成功后，聊天室信息会保存在 user.rooms 数组中
```

### 获取指定聊天室的信息

```
MLIMRoom *room = [MLIMRoom roomWithId:@"gid"];
[room fetchWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
// 获取到的值会自动填充到 room 对应的属性中
```

### 退出聊天室:

```
MLIMRoom *room = [MLIMRoom roomWithId:@"rid"];
[room removeMembers:@[@"Bob"] block:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 成功 ...
    }
}];
```

### 解散聊天室

```
MLIMRoom *room = [MLIMRoom roomWithId:@"rid"];
[room deleteWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

## 游客管理

### 创建或更新游客

创建游客和更新游客信息使用的是同一个接口。如果传入的属性字典中有 id 字段，并且这个游客已经存在，那就是更新操作，否则系统会创建一个新的游客。

#### 创建游客：

```
// 注意：这个字典中没有 id 字段
NSDictionary *attrs = @{@"foo":@"bar", @"age":@23};
[MLIMPassenger createOrUpdatePassengerWithAttributes:attrs
                                          completion:^(MLIMPassenger * _Nullable passenger, NSError * _Nullable error)
{
    // ...
}];
```

#### 更新游客信息：

假设存在一个 id 为 772b12084d7c413a9d03df04363b71dd 的游客，更新他的信息：

```
// 注意：这个字典中必须填写 id 字段
NSDictionary *attrs = @{@"id":@"772b12084d7c413a9d03df04363b71dd", 
					    @"foo":@"bar", 
					    @"age":@23};
[MLIMPassenger createOrUpdatePassengerWithAttributes:attrs
                                          completion:^(MLIMPassenger * _Nullable passenger, NSError * _Nullable error)
{
    // ...
}];
```

如果你已经持有一个 `passenger` 对象(`passenger.pid` 不能为空)，可以这样更新：

```
MLIMPassenger *passenger;
NSDictionary *attrs = @{@"nickname":@"xiaobao"};
[passenger updatePassengerAttributes:attrs completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
    	// ...
    }
}];
```

### 根据游客 ID 获取游客信息

```
NSString *pid = @"772b12084d7c413a9d03df04363b71dd";
MLIMPassenger *passenger = [MLIMPassenger passengerWithId:pid];
[passenger fetchWithCompletion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
    	// ...
    }
}];
```

## 消息(聊天)

### 消息实体类

在 `MaxIMLib` 中, `MLIMMessage` 代表一条消息。它其中字段的含义如下：

1. **`mediaType`**: 消息媒体类型，目前支持文本，图片，音频，视频四种类型

2. **`text`**: 文本消息内容，如果 `mediaType` 不是文本类型，该字段内容会被忽略

3. **`attachmentUrl`**: 非文本消息(如音频消息，图片消息)的附件地址，文本消息忽略该字段

4. **`sender`**: 发送者，表示谁发送过来的，**MaxIM 支持多终端登录和同步消息，发送方有可能是当前登录用户，说明这条消息是该用户使用别的终端发送的消息**

    `sender.type` 消息来源类型，好友／群组／聊天室／游客<br>
    `sender.userId` 发送者的 ID<br>
    `sender.groupId` 如果消息来自群组，该字段表示该群组的 ID，否则为 nil<br>
    `sender.roomId` 如果消息来自聊天室，该字段表示该群组的 ID，否则为 nil

5. **`receiver`**: 接收方，跟 `sender` 有一样的结构

6. **`status`**: 消息状态，发送中，发送成功，发送失败等

7. **`sendTimestamp`**: 消息发送时间，距离1970年的秒数

### 聊天

- 跟单个用户聊天需要先加对方好友，同样的，向群组和聊天室发送消息需要先加入对应的群组和聊天室。
- 好友离线时，消息会通过离线消息推送发给对方，详细信息请查阅[离线消息推送](#offline_message_push)小节。
- 好友消息和群组消息会在云端保存七天，聊天室消息不会保存。

### 发送文本消息

发送给好友／群组／聊天室的消息是通过 socket 发送的。

```
// 登录成功的状态下
// 创建一条文本消息
MLIMMessage *message = [MLIMMessage messageWithText:@"Hi!"];

// 消息发给谁是通过设置 receiver 实现的，注意 receiver 只能设置一次，第二次改变可能会失效

// 指定消息的接收者为好友 Jerry，这条消息就会发送给 Jerry
message.receiver.userId = @"Jerry";
// 指定消息的接收者为群组 GroupA，这条消息就会发送给ID为 GroupA 的群组
message.receiver.groupId = @"GroupA";
// 指定消息的接收者为聊天室 RoomA，这条消息就会发送给ID为 RoomA 的聊天室
message.receiver.roomId = @"RoomA";
    
[client sendMessage:message completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (!succeeded) {
        NSLog(@"消息发送失败, error: %@", error);
    }
    [self.tableView reloadData];
    [self scrollToBottom];
}];
```

也可以使用 SDK 提供的便捷方法，这些便捷方法会自动更改 `message.receiver`：

`-[MLIMClient sendMessage:toFriend:completion:]`<br>
`-[MLIMClient sendMessage:toGroup:completion:]`<br>
`-[MLIMClient sendMessage:toRoom:completion:]`

### 接收消息

1. 实现代理方法

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
    
    // 接收好友的消息
    - (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromFriend:(MLIMFriendInfo *)aFriend {
    	if ([aFriend.uid isEqualToString:@"Tom"]) {
    		if ([message.sender.userId isEqualToString:client.currentUser.uid]) {
    			// NSLog(@"Did receive Jerry's message send via another client.");
    		} else {
    			// NSLog(@"Did receive Tom's message");
    		}
    	}
    }
    
    // 接收群组消息
    - (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromGroup:(MLIMGroup *)group {
    	if ([message.sender.userId isEqualToString:client.currentUser.uid]) {
    		// NSLog(@"Did receive Jerry's message send to the group via another client.");
    	} else {
    		// NSLog(@"Did receive group message：%@"， message);
    	}
    }
    
    // 接收聊天室消息
    - (void)client:(MLIMClient *)client didReceiveMessage:(MLIMMessage *)message fromRoom:(MLIMRoom *)room {
    	if ([message.sender.userId isEqualToString:client.currentUser.uid]) {
    		// NSLog(@"Did receive Jerry's message send to the room via another client.");
    	} else {
    		// NSLog(@"Did receive room message：%@"， message);
    	}
    }
    ```

2. 监听通知
    
    ```
    // 所有非系统消息都会通过这个通知发送
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveMessage:) name:MLIMClientDidReceiveMessageNotification object:nil];
    
    
    - (void)didReceiveMessage:(NSNotification *)notification {
    
        // 取出这条消息
        MLIMMessage *message = notification.userInfo[@"msg"];
        
        // 判断消息是否来自好友 Jerry
        BOOL fromFriend = message.sender.type == MLIMMessageTargetTypeFriend && [message.sender.userId isEqualToString:@"Jerry"];
        
        // 判断消息是否来自群组 GroupA 
        BOOL fromGroup = message.sender.type == MLIMMessageTargetTypeGroup && [message.sender.groupId isEqualToString:@"GroupA"];
        
        // 判断消息是否来自聊天室 RoomA
        BOOL fromRoom = message.sender.type == MLIMMessageTargetTypeRoom && [message.sender.roomId isEqualToString:@"RoomA"];
        
        // 当前用户
        NSString *cuid = [MLCDataManager currentUser].uid;
        
        // 判断消息是否是当前用户使用其他终端发送给 Jerry 的
        BOOL fromSelfToFriend = [message.sender.userId isEqualToString:cuid]
        && [message.receiver.userId isEqualToString:@"Jerry"];
        
        // 判断消息是否是当前用户使用其他终端发送给群组 GroupA 的
        BOOL fromSelfToFriend = [message.sender.userId isEqualToString:cuid]
        && [message.receiver.groupId isEqualToString:@"GroupA"];
        
        // 判断消息是否是当前用户使用其他终端发送给聊天室 RoomA 的
        BOOL fromSelfToFriend = [message.sender.userId isEqualToString:cuid]
        && [message.receiver.roomId isEqualToString:@"RoomA"];
    }
    ```

### 多媒体消息

除了基本的文字聊天，MaxIM 也支持多媒体消息，多媒体消息在初始化时需要多媒体文件。

构建多媒体消息：

```
// 图片消息
MLIMMessage *imageMsg = [MLIMMessage messageWithImage:image];

// 视频消息
NSString *path = [[NSBundle mainBundle] pathForResource:@"IMG_0018" ofType:@"m4v"];
MLIMMessage *videoMsg = [MLIMMessage messageWithVideoFileAtPath:path];

// 音频消息
MLIMMessage *message = [MLIMMessage messageWithAudioFileAtPath:audioFilePath];
```

调用发送消息的接口时会先上传多媒体文件，为了聊天实时性，请严格控制多媒体文件的大小。

```
[client sendMessage:message progress:^(int percentDone) {
    NSLog(@"消息附件上传进度: %d%%", percentDone);
} completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // 消息发送成功
    } else {
        NSLog(@"消息发送失败, error: %@", error);
    }
}];
```

### 多终端消息同步

MaxIM 支持多终端同时登录和多终端消息同步。如果用户同时登录的终端A和终端B，他使用终端A发送消息，那么终端B会收到这条消息，判断方法如下：

```
if ([message.sender.userId isEqualToString:client.currentUser.uid]) {
    // 这条消息是当前登录用户使用别的终端发送的
}
```

### 系统消息

系统消息不是通过 socket 发送的。

#### 发送系统消息

```
MLIMMessage *msg = [MLIMMessage messageWithText:@"test"];
// 注意：发送目标只能设置一次
// 设置发送目标为某个用户
msg.receiver.userId = @"Jerry";

// 设置发送目标为
msg.receiver.groupId = @"GroupA";

// 设置发送目标为聊天室
msg.receiver.roomId = @"RoomA";

// 发送消息
[client sendSystemMessage:message progress:^(int percentDone) {
    // 多媒体消息附件上传进度
} completion:^(BOOL succeeded, NSError * _Nullable error) {
    // ...
}];
```

也可以使用 SDK 提供的便捷接口发送消息：

`-[MLIMClient sendSystemMessage:toUser:completion:]`<br>
`-[MLIMClient sendSystemMessage:toGroup:completion:]`<br>
`-[MLIMClient sendSystemMessage:toRoom:completion:]`

发送给所有用户:

```
[client sendSystemMessageToAllUsers:msg completion:^(BOOL succeeded, NSError * _Nullable error) {
    if (succeeded) {
        // ...
    }
}];
```

#### 接受系统消息

接收到的系统消息不会带有 sender 和 receiver 信息。

1. 实现代理方法

    ```
    #pragma mark - MLIMClientDelegate
    
    - (void)client:(MLIMClient *)client didReceiveSystemMessage:(MLIMMessage *)message {
    	NSLog(@"Did receive room message：%@"， message);
    	// 接收到的系统消息可能不带有发送者以及接受者的信息
    }
    ```

2. 监听通知

    ```
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceiveSysMessage:) name:MLIMClientDidReceiveSystemMessageNotification object:nil];
    
    
    - (void)didReceiveSysMessage:(NSNotification *)notification {
        // 取出这条消息
        MLIMMessage *message = notification.userInfo[@"msg"];
        // message 不带有 receiver 和 sender 信息
        // ...
    }
    ```

### 聊天记录

**好友和群组聊天记录会在云端保存七天，其他消息不会保存。**

#### 获取好友的聊天记录

```
// 获取当前时间之前最新的十条历史消息（包括自己发的）
NSTimeInterval ts = [[NSDate date] timeIntervalSince1970];
[client.currentUser getLatestChatsWithFriend:@"friend_uid" beforeTimestamp:ts limit:10 block:^(NSArray<MLIMMessage *> * _Nullable messages, NSError * _Nullable error) {
    if (!error) {
        NSLog(@"lastest history messages: %@", messages);
    }
}];
```

#### 获取群组聊天记录

```
// 获取当前时间最新的十条消息（包括自己发送的）
NSTimeInterval ts = [[NSDate date] timeIntervalSince1970];
[group getLatestMessagesBefore:ts limit:10 completion:^(NSArray<MLIMMessage *> * _Nullable messages, NSError * _Nullable error) {
    if (!error) {
        NSLog(@"lastest group messages: %@", messages);
    }
}];
```

#### 获取游客最新的聊天记录

```
NSTimeInterval ts = [[NSDate date] timeIntervalSince1970];
NSString *pid = @"772b12084d7c413a9d03df04363b71dd";
MLIMPassenger *passenger = [MLIMPassenger passengerWithId:pid];
[passenger getHistoryMessagesWithUser:@"wind"
                           beforeTime:ts
                                limit:20
                           completion:^(NSArray<MLIMMessage *> *_Nullable messages,
                                        NSError * _Nullable error)
{
    NSLog(@"messages: %@, error: %@", messages, error);
}];
```

<span id="offline_message_push"></span>
### 离线推送消息

当用户离线，并且没用注销的时候，如果收到好友或者群组消息，系统会尝试给该用户发送推送。为了使用户能正常接收推送消息，请客户端远程推送功能。

开启远程推送的流程如下：

#### 集成 MaxLeap.framework

MaxIM 离线消息推送依赖于 MaxLeap 推送服务，所以需要集成 MaxLeap.framework，集成方法请查阅：[QuickStart - Core SDK](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS)

另外，在创建 MLIMCient 实例的时候需要传入当前的 installationId :

```
MLIMClientConfiguration *configuration = [MLIMClientConfiguration 
defaultConfiguration];
configuration.appId = @"Your_MaxLeap_ApplicationId";
configuration.clientKey = @"Your_MaxLeap_ClientKey";

// 需要配置 installationId 才能收到离线推送
configuration.installationId = [MLInstallation currentInstallation].installationId;

MLIMClient *client = [MLIMClient clientWithConfiguration:configuration];
```

#### 配置

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

## 自定义属性

MaxIM 系统可以给一个游客、用户、群组或者聊天室设置自定义属性。自定义属性保存在一个 JSON Object 中，键值必须是 JSON 支持的数据类型，可以嵌套，键值对可以随意增加。

该节提到的 API 适用于 `MLIMUser`、`MLIMGroup`、`MLIMRoom`，`MLIMPassenger` 请参照 [游客] 小节。 

### 部分更新自定义属性：

```
id object; // MLIMUser, MLIMGroup 或 MLIMRoom

// 只更新该字典中存在的键值对，其他的不受影响。
NSDictionary *attrs = @{@"nickname":@"acher", @"age":@29};

[object updateAttributes:attrs completion:^(BOOL success, NSError * _Nullable error) {
    NSLog(@"attributes: %@", object.attributes);
}];
```

### 覆盖更新自定义属性

```
id object; // MLIMUser, MLIMGroup 或 MLIMRoom

// 不同于部分更新，该接口直接使用新的字典覆盖用户属性
NSDictionary *attrs = @{@"nickname":@"acher", @"age":@29};

[object replaceAttributes:attrs completion:^(BOOL success, NSError * _Nullable error) {
    NSLog(@"attributes: %@", object.attributes);
}];
```

### 获取自定义属性

```
id object; // MLIMUser, MLIMGroup 或 MLIMRoom

[object fetchAttributesWithCompletion:^(NSDictionary * _Nullable attrs, NSError * _Nullable error) {
    NSLog(@"attributes: %@", object.attributes);
}];
```

### 获取单个自定义属性的值

```
id object; // MLIMUser, MLIMGroup 或 MLIMRoom

[object getAttributeForKey:@"age" completion:^(id  _Nullable value, NSError * _Nullable error) {
	// 注意：如果 age 对应的值为空，value 会是一个 NSNull 对象
    NSLog(@"value: %@", value);
}];
```

### 删除所有的自定义属性

```
id object; // MLIMUser, MLIMGroup 或 MLIMRoom

[object deleteAttributesWithCompletion:^(BOOL success, NSError * _Nullable error) {
    if (success) {
        //...
    }
}];
```

## 查询

MaxIM 也支持对用户、群组、聊天室进行查询，根据它们的自定义属性进行过滤。SDK 使用一个 `MLIMQuery` 来实现查询，它使用起来跟 `MLQuery` 类似，但是简化很多。

查询分为三步：

1. 创建一个 `MLIMQuery` 对象；
2. 为 `MLIMQuery` 对象添加过滤条件；
3. 执行查询方法，获取与过滤条件相匹配的数据。

例如，查询自定义属性的 `type` 值为 1 的用户，并按照 `age` 升序排列：

```
MLIMQuery *query = [MLIMQuery query];
[query whereAttribute:@"type" equalTo:@"1"];
[query orderByAscending:@"age"];
[query findUserWithBlock:^(NSArray<MLIMUser *> * _Nullable result, NSError * _Nullable error) {
    XCTAssertTrue(result.count <= query.limit);
    fulfill();
}];
```

### 查询约束

设置查询约束, 这个约束支持模糊查询：

**注意：**equalTo: 参数值是 String 类型

```
[query whereAttribute:@"type" equalTo:@"1"];
```

也可以添加多个约束，它们之间是 AND 的关系：

```
[query whereAttribute:@"type" equalTo:@"1"];
[query whereAttribute:@"gender" equalTo:@"male"];
```

可以通过设置 `limit` 来限制结果的数量，默认的数量限制为 20：

```
query.limit = 30; // 最多返回三十条数据
```

`skip` 用来跳过查询结果中开头的一些数据，配合 `limit` 可以对结果进行分页：

```
query.skip = 2*30; // 跳过前 60 条数据，如果 limit 为 30，就是获取第三页数据
```

对结果进行排序：

对于可排序的数据，如数字和字符串，你可以控制结果返回的顺序:

```
// Sorts the results in ascending order by the createdAt field
[query orderByAscending:@"createdAt"];
// Sorts the results in descending order by the createdAt field
[query orderByDescending:@"createdAt"];
```

一个查询可以使用多个排序键，如下：

```
// Sorts the results in ascending order by the score field if the previous sort keys are equal.
[query addAscendingOrder:@"score"];
// Sorts the results in descending order by the score field if the previous sort keys are equal.
[query addDescendingOrder:@"username"];
```

### 推送证书设置指南

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

