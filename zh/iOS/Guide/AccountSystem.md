# 账号服务

## 准备

> 基础用户管理功能集成在 `MaxLeap.framework` 中，如果还没有集成，请先查阅[快速入门指南](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_IOS)，安装 SDK 并使之在 Xcode 中运行。

第三方登录需要集成 `ML**Utils.framework` 和第三方平台对应 SDK。

您还可以查看我们的 [API 参考](ML_DOCS_LINK_PLACEHOLDER_API_REF_IOS)，了解有关我们 SDK 的更多详细信息。

**注意**：我们支持 iOS 7.0 及以上版本。

## 用户管理

我们提供了用于用户管理的类，叫做 `MLUser`，可自动处理用户帐户管理需要的很多功能。

你可以使用这个类在应用程序中添加用户帐户功能。

`MLUser` 是 `MLObject` 的一个子类，拥有与之完全相同的特性，如键值对接口。`MLObject` 上的所有方法也存在于 `MLUser` 中。不同的是 `MLUser` 具有针对用户帐户的一些特殊的附加功能。

### SDK 自动创建匿名用户

因为一些特殊原因，SDK 中有一个逻辑：它会在没有用户登录的情况下自动创建一个匿名用户，有关匿名用户，请查看匿名用户介绍。

	- 启动应用程序时，若 currentUser 为空，则会创建一个匿名用户
	- 用户登出后，SDK 会自动创建一个匿名用户
	- 这个过程是定时器驱动的，有一定的延迟，如果应用在某个时刻需要匿名登录，却发现当前用户为空，就需要手动创建匿名用户

**注意：**还需要特别注意的是，假如当前用户是一个匿名用户，这个时候直接调用注册接口，sdk 会把这个匿名用户更新成为一个普通用户，而不会创建一个新用户。

对于以上提到的`用户`、`当前用户`、`匿名用户`的含义以及其功能特性，在以下几个小节有详细解释。

### 字段说明

`MLUser` 有几种可以将其与 `MLObject` 区分开的属性：

- `username`：用户的用户名（必填）。
- `password`：用户的密码（注册时必填）。
- `email`：用户的电子邮箱地址（选填）。

切记，如果您通过这些属性设置 `username` 和 `email`，则无需使用 `setObject:forKey:` 方法进行设置。

### 注册用户

您的应用程序要做的第一件事就是让用户注册。以下代码示范了一个典型注册过程：

```objective_c
- (void)myMethod {
    MLUser *user = [MLUser user];
    user.username = @"my_name";
    user.password = @"my_password";
    user.email = @"email@example.com";
    // other fields can be set just like with MLObject
    user[@"mobilePhone"] = @"415-392-0202";
    [user signUpInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
        if (!error) {
            // Hooray! Let them use the app now.
        } else {
            NSString *errorString = [error userInfo][@"error"];
            // Show the errorString somewhere and let the user try again.
        }
    }];
}
```

这个调用将在您的 MaxLeap 应用中异步创建一个新的用户。创建前，它还会检查确保用户名和邮箱唯一。此外，MaxLeap 只保存密码的密文。我们从来不明文储存密码，也不会将密码明文传输回客户端。

**注意**，我们使用的是 `-[user signUpInBackgroundWithBlock:]` 方法，而不是 `-[user saveInBackgroundWithBlock:]` 方法。应始终使用 `-[user signUpInBackgroundWithBlock:]` 方法创建新的 `MLUser`。调用 `-[user saveInBackgroundWithBlock:]` 可以完成用户的后续更新。

若注册不成功，您应该查看返回的错误对象。最可能的情况就是该用户名或邮箱已被其他用户使用。你应该将这种情况清楚地告诉用户，并要求他们尝试不同的用户名。

您可以使用电子邮箱地址作为用户名。只需让您的用户输入他们的电子邮箱，但是需要将它填写在用户名属性中 － `MLUser` 将可以正常运作。我们将在*重置密码*部分说明是如何处理这种情况的。

### 登录

当然，您让用户注册后，需要让他们以后登录到他们的帐户。为此，您可以使用类方法 `+[MLUser logInWithUsernameInBackground:password:block:]`。

```objective_c
[MLUser logInWithUsernameInBackground:@"myname" password:@"mypass" block:^(MLUser *user, NSError *error) {
    if (user) {
        // Do stuff after successful login.
    } else {
        // The login failed. Check error to see why.
    }
}];
```

### 当前用户（可以用来判断用户登录状态）

当前用户是指当前已经登录的用户，使用方法 `currentUser` 可以获取到当前用户对象，这个对象会被 SDK 自动缓存起来。

可以使用缓存的 `currentUser` 对象实现自动登录，这样用户就不用每次打开应用都要登录了。

每当用户成功注册或者登录后，这个用户对象就会被缓存到磁盘中。这个缓存可以用来判断用户是否登录：

```objective_c
MLUser *currentUser = [MLUser currentUser];
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login screen
}
```

您可以通过注销来清除他们的当前登录状态：

```objective_c
[MLUser logOut];
MLUser *currentUser = [MLUser currentUser]; // this will now be nil
```

**注意：**由于 SDK 会自动创建匿名用户，所以 `currentUser` 有值并不能代表用户已经登录，在检查用户登录状态时，推荐这种方式：

```
MLUser *currentUser = [MLUser currentUser];
if (currentUser) {
    if ([MLAnonymousUtils isLinkedWithUser:currentUser]) {
        // 已经匿名登录
    } else {
        // 常规登录
    }
} else {
    // 未登录
}
```


### 修改密码

可以通过更新 `password` 字段来更改密码：

```
[MLUser currentUser].password = @"the new password";
[[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
    if (succeeded) {
        // ...
    } else {
        // handle the error
    }
}];
```

为了安全起见，在更改密码前需要让用户输入旧密码并验证是否与当前账户匹配：

```
NSString *theOldPassword;
NSString *theNewPassword;

[[MLUser currentUser] checkIsPasswordMatchInBackground:theOldPassword block:^(BOOL isMatch, NSError *error) {
    if (isMatch) {
        [MLUser currentUser].password = theNewPassword;
        [[MLUser currentUser] saveInBackgroundWithBlock:^(BOOL succeeded, NSError *error) {
            if (succeeded) {
                // ...
            } else {
                // handle the error
            }
        }];
    } else {
        // handle the error
    }
}];
```

### 重置密码

您刚刚将密码录入系统时就忘记密码的情况是存在的。这种情况下，我们的库提供一种方法让用户安全地重置密码。

若要开始密码重置流程，让用户填写电子邮箱地址，并调用：

```objective_c
[MLUser requestPasswordResetForEmailInBackground:@"email@example.com"];
```

该操作将尝试将给定的电子邮箱与用户电子邮箱或用户名字段进行匹配，并向用户发送密码重置邮件。这样，您可以选择让用户使用其电子邮箱作为用户名，或者您可以单独收集它并把它储存在电子邮箱字段。

密码重置流程如下：

1. 用户输入电子邮箱地址，请求重置密码。
2. MaxLeap 向其电子邮箱发送一封包含专用密码重置链接的邮件。
3. 用户点击重置链接，进入专用 MaxLeap 页面，用户在该页面输入新密码。
4. 用户输入新密码。现在，用户的密码已经被重置为他们指定的值。

**注意**：该流程中的消息传送操作将根据您在 MaxLeap 上创建该应用时指定的名称引用您的应用程序。

### 查询用户

出于安全考虑，不允许客户端查询用户表。

### 邮箱验证

在 MaxLeap 应用设置中启用电子邮箱验证，可以让应用将部分使用体验提供给验证过电子邮箱地址的用户。电子邮箱验证会将 `emailVerified` 键添加到 `MLUser` 中。`MLUser` 的 `email` 被修改后，`emailVerified` 被设置为 `false`。随后，MaxLeap 会向用户发送一个邮件，其中包含一个链接，点击这个链接，可将 `emailVerified` 设置为 `true`。

有三种 `emailVerified` 状态需要考虑：

1. `true` － 用户通过点击 MaxLeap 发送给他们的链接确认电子邮箱地址。最初创建用户帐户时，`MLUsers` 没有 `true` 值。
2. `false` － `MLUser` 对象最后一次刷新时，用户未确认其电子邮箱地址。若 `emailVerified` 为 `false`，可以考虑调用 `+[MLDataManager fetchDataOfObjectInBackground:block:]`，把 `MLUser` 传递给第一个参数。
3. 缺失 － 电子邮箱验证关闭或没有填写 `email`。


### 匿名用户

能够将数据和对象与具体用户关联非常有价值，但是有时您想在不强迫用户输入用户名和密码的情况下也能达到这种效果。

匿名用户是指能在无用户名和密码的情况下创建的但仍与任何其他 `MLUser` 具有相同功能的用户。登出后，匿名用户将被抛弃，其数据也不能再访问。

您可以使用 `MLAnonymousUtils` 创建匿名用户：

```objective_c
[MLAnonymousUtils logInWithBlock:^(MLUser *user, NSError *error) {
    if (error) {
        NSLog(@"Anonymous login failed.");
    } else {
        NSLog(@"Anonymous user logged in.");
    }
}];
```

您可以通过设置用户名和密码，然后调用 `-[user signUpInBackgroundWithlock:]` 的方式，或者通过登录或关联 *微博* 或 *微信* 等服务的方式，将匿名用户转换为常规用户。转换的用户将保留其所有数据。想要判断当前用户是否为匿名用户，可以使用 `+[MLAnonymousUtils isLinkedWithUser:]` 方法:

```objective_c
if ([MLAnonymousUtils isLinkedWithUser:[MLUser currentUser]]) {
    // current user is anonymous
} else {
    // current user is regular
}
```

## 第三方登录

为简化用户的注册及登录流程，并且集成 MaxLeap 应用与 微博, 微信 等应用，MaxLeap 提供了第三方登录应用的服务。您可以同时使用第三方应用 SDK 与 MaxLeap SDK，并将 `MLUser` 与第三方应用的用户ID进行连接。

### 使用微博账号登陆

MaxLeap SDK 能够与微博 SDK 集成，使用微博账号登陆。

```
[MLWeiboUtils loginInBackgroundWithScope:@"all" block:^(MLUser * _Nullable user, NSError * _Nullable error) {
    if (user) {
        // 登陆成功
    } else {
        // 登陆失败
    }
}];
```

使用微博账号登录后，如果该微博用户并未与任何 `MLUser` 绑定，MaxLeap 将创建一个 `MLUser`，并与其绑定。

#### 准备工作

若要通过 MaxLeap 使用微博，您需要：

1. 前往[微博开放平台][weibo_develop_site]，[创建微博应用][set up weibo app]。
2. 在 “微博应用 >> 应用信息 >> 高级信息” 中仔细填写授权回调页和取消授权回调页地址。授权回调页地址在集成微博 SDK 的时候需要用到。
3. 前往 [MaxLeap 控制台][maxleap_console]，在 MaxLeap 应用设置 >> 用户验证 页面打开 “允许使用新浪微博登录” 开关。
4. 下载 [微博 iOS SDK](https://github.com/sinaweibosdk/weibo_ios_sdk)
5. 把 libWeiboSDK 文件夹添加到项目中，注意选择 Group Reference。
6. 下载解压 [MaxLeap iOS SDK (maxleap-sdk-ios-*.zip)](https://github.com/MaxLeap/SDK-iOS/releases)。
7. 把 `MLWeiboUtils.framework` 添加到项目中。
8. 初始化 `MLWeiboUtils`，比如在 `application:didFinishLaunchingWithOptions:` 方法中:

	```objective_c
	- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	    [MaxLeap setApplicationId:@"your_maxleap_appId" clientKey:@"your_maxleap_clientKey" site:MLSiteCN];
	    [MLWeiboUtils initializeWeiboWithAppKey:@"your_weibo_app_key" redirectURI:@"微博应用授权回调页"];
	    return YES;
	}
	```

5. 处理授权回调
	
	```
	- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
   		return [WeiboSDK handleOpenURL:url delegate:self];
	}

	- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(id)annotation {
    	return [WeiboSDK handleOpenURL:url delegate:self];
	}

	- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options {
	    return [WeiboSDK handleOpenURL:url delegate:self];
	}
	```
	
6. 处理授权响应
	
	```
	#pragma mark WeiboSDKDelegate
	
	- (void)didReceiveWeiboResponse:(WBBaseResponse *)response {
       if ([response isKindOfClass:[WBAuthorizeResponse class]]) {
           [MLWeiboUtils handleAuthorizeResponse:(WBAuthorizeResponse *)response];
	    } else {
	        // 处理其他请求的响应
	    }
	}
	```

若您遇到与微博相关的任何问题，请查阅 [微博官方文档][weibo documentation]。

MaxLeap 用户可通过以下两种主要方法使用微博：(1) 以微博用户身份登录，并创建 `MLUser`。(2) 将微博账号与已有的 `MLUser` 关联。

#### 登录并注册新 MLUser

`MLWeiboUtils` 提供一种方法让您的 `MLUser` 可以通过 `微博` 登录或注册。这可以使用 `logInWithBlock` 方法实现：

```objective_c
[MLWeiboUtils loginInBackgroundWithScope:@"all" block:^(MLUser * _Nullable user, NSError * _Nullable error) {
    if (!user) {
        NSLog(@"微博登陆失败");
    } else if (user.isNew) {
        NSLog(@"用户使用微博账户成功注册并登陆");
    } else {
        NSLog(@"用户使用微博账户登陆");
    }
}];
```

该代码运行时，会出现以下情况：

1. 若设备安装了新浪微博客户端，则会跳转到微博客户端请求授权，否则弹出微博授权网页。
2. 用户确认授权，您的应用程序会收到回调。
3. 您的应用程序收到授权响应，并交由 `MLWeiboUtils` 处理，`[MLWeiboUtils handleAuthorizeResponse:(WBAuthorizeResponse *)response];`
3. 我们的 SDK 会收到微博数据并将其保存在 `MLUser` 中。如果是基于微博身份的新用户，那么该用户随后会被创建。
4. 您的 `block` 被调用并带回这个用户对象(user)。

#### 绑定 `MLUser` 与微博账号

若您想要将已有的 `MLUser` 与微博帐户关联起来，您可以按以下方式进行关联：

```objective_c
if (![MLWeiboUtils isLinkedWithUser:user]) {
    [MLWeiboUtils linkUserInBackground:user withScope:@"all" block:^(BOOL succeeded, NSError * _Nullable error) {
        if ([MLWeiboUtils isLinkedWithUser:user]) {
            NSLog(@"Woohoo, user linked with Weibo!");
        }
    }];
}
```

关联时发生的步骤与登录非常类似。区别是在成功登录中，将会使用来自微博的信息更新当前的 `MLUser`。今后通过微博进行的登录会返回已存在的 `MLUser`。

#### 解除绑定

若您想要取消用户与微博的关联，操作如下：

```objective_c
[MLWeiboUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError * _Nullable error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their Weibo account.");
    }
}];
```

在当前用户已经关联了微博账户的情况下，可以使用 `[MLWeiboAccessToken currentAccessToken].accessToken` 获取用户身份验证令牌。

### 使用微信账号登陆

集成微信 SDK 的过程与微博非常相似。

#### 准备工作

若要与微信集成，您需要：

1. 前往[微信开放平台][wechat_develop_site]，创建微信移动应用。
2. 前往 [MaxLeap 控制台][maxleap_console]，在 MaxLeap 应用设置 >> 用户验证 页面打开 “允许使用微信登录” 开关。
3. [下载微信 iOS SDK（iOS开发工具包64位）](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419319164&token=&lang=zh_CN)
4. 下载解压 [MaxLeap iOS SDK (maxleap-sdk-ios-*.zip)](https://github.com/MaxLeap/SDK-iOS/releases)。
5. 把 `MLWeChatUtils.framework` 添加到项目中。
6. 初始化 `MLWeChatUtils`，比如在 `application:didFinishLaunchingWithOptions:` 方法中:

	```objective_c
	- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	    [MaxLeap setApplicationId:@"your_maxleap_appId" clientKey:@"your_maxleap_clientKey" site:MLSiteCN];
	    [MLWeChatUtils initializeWeChatWithAppId:@"your_weixin_appID" appSecret:@"your_weixin_AppSecret"];
	    return YES;
	}
	```

4. 处理授权回调
	
	```
	- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
   		return [WXApi handleOpenURL:url delegate:self];
	}

	- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(nullable NSString *)sourceApplication annotation:(id)annotation {
    	return [WXApi handleOpenURL:url delegate:self];
	}

	- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString*, id> *)options {
	    return [WXApi handleOpenURL:url delegate:self];
	}
	```
	
5. 处理授权响应
	
	```
	#pragma mark WXApiDelegate
	
	- (void)onResp:(BaseResp *)resp {
       if ([resp isKindOfClass:[SendAuthResp class]]) {
           [MLWeChatUtils handleAuthorizeResponse:(SendAuthResp *)resp];
       } else {
	       // 处理其他请求的响应
	    }
	}
	```

若您遇到与微信相关的任何问题，请查阅 [微信官方文档][wechat documentation]。

MaxLeap 用户可通过以下两种主要方法使用微信：(1) 以微信用户身份登录，并创建 `MLUser`。(2) 将微信账号与已有的 `MLUser` 关联。

#### 登录并注册新 MLUser

`MLWeChatUtils` 提供了一个方法让您的 `MLUser` 可以通过微信登录或注册。这可以使用 `logInWithBlock` 方法实现：

```objective_c
[MLWeChatUtils loginInBackgroundWithScope:@"snsapi_userinfo" block:^(MLUser * _Nullable user, NSError * _Nullable error) {
    if (!user) {
        NSLog(@"微信登陆失败");
    } else if (user.isNew) {
        NSLog(@"用户使用微信账户成功注册并登陆");
    } else {
        NSLog(@"用户使用微信账户登陆");
    }
}];
```

该代码运行时，会出现以下情况：

1. 跳转到微信客户端请求授权。
2. 用户确认授权，您的应用程序会收到回调。
3. 您的应用程序收到授权响应，并交由 `MLWeChatUtils` 处理，`[MLWeChatUtils handleAuthorizeResponse:(WBAuthorizeResponse *)response];`
3. 我们的 SDK 会收到微博数据并将其保存在 `MLUser` 中。如果是基于微信身份的新用户，那么该用户随后会被创建。
4. 您的 `block` 被调用并带回这个用户对象(user)。

#### 绑定 `MLUser` 与微信账号

若您想要将已有的 `MLUser` 与微信帐户关联起来，您可以按以下方式进行关联：

```objective_c
if (![MLWeChatUtils isLinkedWithUser:user]) {
    [MLWeChatUtils linkUserInBackground:user withScope:@"snsapi_userinfo" block:^(BOOL succeeded, NSError * _Nullable error) {
        if ([MLWeChatUtils isLinkedWithUser:user]) {
            NSLog(@"Woohoo, user linked with Wechat!");
        }
    }];
}
```

关联时发生的步骤与登录非常类似。区别是在成功登录中，将会使用来自微信的信息更新当前的 `MLUser`。今后通过该微信账号进行的登录会返回已存在的 `MLUser`。

#### 解除绑定

若您想要取消用户与微信的关联，操作如下：

```objective_c
[MLWeChatUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError * _Nullable error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their Wechat account.");
    }
}];
```

在当前用户已经关联了微信账户的情况下，可以使用 `[MLWeChatAccessToken currentAccessToken].accessToken` 获取用户身份验证令牌。

### 使用 QQ 账号登陆

MaxLeap SDK 能够与 TencentOpenAPI SDK 集成，使用 QQ 账号登陆。

```
NSArray *permissions = @[@"get_user_info", @"get_simple_userinfo", @"add_t"];
[MLQQUtils loginInBackgroundWithPermissions:permissions block:^(MLUser * _Nullable user, NSError * _Nullable error) {
    if (user) {
        // 登陆成功
    } else {
        // 登陆失败
    }
}];
```

使用 QQ 账号登录后，如果该 QQ 用户并未与任何 `MLUser` 绑定，MaxLeap 将创建一个 `MLUser`，并与其绑定。

#### 准备工作

若要通过 MaxLeap 使用 QQ ，您需要：

1. 前往[腾讯开放平台][open_qq_site]，[创建 QQ 应用][set_up_qq_app]。
2. 前往 [MaxLeap 控制台][maxleap_console]，前往 MaxLeap 应用设置 >> 用户验证 页面，打开"允许QQ登录"选项。
3. [下载腾信开发平台 SDK][qq_documentation]
4. 把 `TencentOpenAPI.framework` 和 `TencentOpenAPI_iOS_Bundle.bundle` 添加到项目中。
5. 下载解压 [MaxLeap iOS SDK (maxleap-sdk-ios-*.zip)](https://github.com/MaxLeap/SDK-iOS/releases)。
6. 把 `MLQQUtils.framework` 添加到项目中。
5. 初始化 `MLQQUtils`，比如在 `application:didFinishLaunchingWithOptions:` 方法中:

	```objective_c
	- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
	    [MaxLeap setApplicationId:@"your_maxleap_appId" clientKey:@"your_maxleap_clientKey" site:MLSiteCN];
	    [MLQQUtils initializeQQWithAppId:@"222222" qqDelegate:self]; // self 不能为空且需遵循 TencentSessionDelegate 协议
	    return YES;
	}
	```

6. 实现 TencentSessionDelegate 协议方法
	
	```
	#pragma mark TencentLoginDelegate
	
	// 以下三个方法保持空实现就可以，MLQQUtils 会置换这三个方法，但是会调用这里的实现
	
	- (void)tencentDidLogin {
    
	}
	
	- (void)tencentDidNotLogin:(BOOL)cancelled {
    
	}

	- (void)tencentDidNotNetWork {
    
	}
	```


若您遇到与 TencentOpenAPI SDK 相关的任何问题，请查阅 [腾讯官方文档][qq_documentation]。

MaxLeap 用户可通过以下两种主要方法使用 QQ：(1) 以QQ用户身份登录，并创建 `MLUser`。(2) 将QQ账号与已有的 `MLUser` 关联。

#### 登录并注册新 MLUser

`MLQQUtils` 提供一种方法让您的 `MLUser` 可以通过 `微博` 登录或注册。这可以使用 `loginInBackgroundWithPermissions:block:` 方法实现：

```objective_c
NSArray *permissions = @[@"get_user_info", @"get_simple_userinfo", @"add_t"];
[MLQQUtils loginInBackgroundWithPermissions:permissions block:^(MLUser * _Nullable user, NSError * _Nullable error) {
    if (!user) {
        NSLog(@"QQ登陆失败");
    } else if (user.isNew) {
        NSLog(@"用户使用QQ账户成功注册并登陆");
    } else {
        NSLog(@"用户使用QQ账户登陆");
    }
}];
```

该代码运行时，会出现以下情况：

1. 若设备安装了新浪QQ客户端，则会跳转到QQ客户端请求授权，否则弹出QQ授权网页。
2. 用户确认授权，您的应用程序会收到回调。
3. 我们的 SDK 会收到QQ数据并将其保存在 `MLUser` 中。如果是基于QQ身份的新用户，那么该用户随后会被创建。
4. 您的 `block` 被调用并带回这个用户对象(user)。

#### 绑定 `MLUser` 与微博账号

若您想要将已有的 `MLUser` 与微博帐户关联起来，您可以按以下方式进行关联：

```objective_c
if (![MLQQUtils isLinkedWithUser:user]) {
    [MLQQUtils linkUserInBackground:user withPermissions:@[@"all"] block:^(BOOL succeeded, NSError * _Nullable error) {
        if ([MLQQUtils isLinkedWithUser:user]) {
            NSLog(@"Woohoo, user linked with QQ!");
        }
    }];
}
```

关联时发生的步骤与登录非常类似。区别是在成功登录中，将会使用来自微博的信息更新当前的 `MLUser`。今后通过微博进行的登录会返回已存在的 `MLUser`。

#### 解除绑定

若您想要取消用户与微博的关联，操作如下：

```objective_c
[MLQQUtils unlinkUserInBackground:user block:^(BOOL succeeded, NSError * _Nullable error) {
    if (!error && succeeded) {
        NSLog(@"The user is no longer associated with their QQ account.");
    }
}];
```

在当前用户已经关联了 QQ 账户的情况下，可以使用 `[MLQQUtils tencentOAuth].accessToken` 获取用户身份验证令牌。

## 短信验证服务

MaxLeap 短信服务支持的应用场景有以下三种:

- **用户注册/登录：**用户不再需要记住密码，只需要填写手机号和验证码就可以登录，如果用户还没有注册，则会自动注册
- **用户操作验证：**例如银行金融类应用，用户在对资金进行敏感操作（例如转账、消费等）时，需要通过验证码来验证是否为用户本人操作。
- **重设密码：**用户忘记密码时，可以凭借手机验证码重设密码。

### 短信验证码登录

1. **用户输入手机号**
	
	引导用户正确输入，建议在调用 SDK 接口之前，验证一下手机号的格式。
	
2. **请求发送验证码**

	用户点击获取验证码按钮，发送成功后该按钮应该变成不可用状态，然后等待至少60秒再允许重新发送。
	获取验证码按钮事件调用 `+[MLUser requestLoginSmsCodeWithPhoneNumber:block:]` 接口给用户发送验证码。
	
3. **用户输入验证码**
	
	最好验证一下用户输入的是否为纯数字。
	
4. **用户登录，调用 `loginWithPhoneNumber:smsCode:block:` 接口登录**

	```
	[MLUser loginWithPhoneNumber:@"18512340000" 
							 smsCode:@"123456"
							   block:^(MLUser * _Nullable user, NSError * _Nullable error) 
	 {
        if (user) {
            // login success
        } else {
            // login failed
        }
    }];
	```
	
	如果不存在用户名为手机号 `18512340000` 的账户，则会创建一个新用户，用户名为手机号，无密码，`mobilePhone` 字段也是手机号，`mobilePhoneVerified ` 为 `true`。如果存在，直接登录，返回用户的详细信息。

### 验证用户手机号

如果用户填写了手机号，并保存到 `mobilePhone` 字段，此时手机号为未验证状态。如果用户使用某个功能的时候需要验证手机号，可以调用接口进行验证，验证成功后 `mobilePhoneVerified ` 就会被置为 `true`。

1. **请求发送验证码**

	```
	[[MLUser currentUser] requestMobilePhoneVerifySmsCodeWithBlock:^(BOOL succeeded, NSError * _Nullable error) {
        if (succeeded) {
            // 发送成功
        }
    }];
	```
	
2. **调用验证接口，验证用户输入的纯数字验证码**

	```
	[[MLUser currentUser] verifyMobilePhoneWithSmsCode:@"123456" block:^(BOOL succeeded, NSError * _Nullable error) {
        if (succeeded) {
            // 验证成功
        }
    }];
	```

### 重设密码

MaxLeap 提供了通过手机号重设密码的功能，验证过手机号的用户(`mobilePhoneVerified ` 为 `true`)可以使用这种途径重设密码。

1. **用户输入手机号，请求发送验证码**

	```
	[MLUser requestPasswordResetSmsCodeWithPhoneNumber:@"18512340000" block:^(BOOL succeeded, NSError * _Nullable error) {
        if (succeeded) {
            // 验证码发送成功
        }
    }];
	```

2. **用户输入验证码和新密码，重设密码**
	
	建议要求用户输入两次新密码，以免用户输错
	
	```
	[MLUser resetPasswordWithPhoneNumber:@"18512340000" 
									  smsCode:@"123456" 
									 password:@"sine*&wehIHd" 
									    block:^(BOOL succeeded, NSError * _Nullable error) 
   	{
        if (succeeded) {
            // 重设密码成功，建议要求用户使用新密码重新登录
        }
    }];
	```

### 操作认证

用户执行一些敏感操作（比如支付）时，可以使用短信来验证是否是本人操作。步骤如下：

1. **用户点击支付按钮**
2. **调用接口发送短信验证码，并等待用户输入验证码**
	
	建议提供一个重新发送验证码的按钮，验证码发送成功后需等待至少 60 秒才可以再次请求。
	
	注意，在执行这一步时，如果用户还没有提供手机号，则需要要求用户输入手机号。建议要求用户以手机号为用户名注册。
	
	```
	[MLSmsCodeUtils requestSmsCodeWithPhoneNumber:@"18512340000" block:^(BOOL succeeded, NSError * _Nullable error) {
    	if (succeeded) {
        // 验证码发送成功
    	}
	}];
	```
	
3. **用户收到短信，输入验证码**
4. **调用接口验证用户输入的验证码是否有效。**
	
	```
	[MLSmsCodeUtils verifySmsCode:@"123456" phoneNumber:@"18512340000" block:^(BOOL succeeded, NSError * _Nullable error) {
    	if (succeeded) {
      	  // 验证成功
    	}
	}];
	```
	
	注意，以上两个接口需要在用户登录的状态下使用。

## 适配 iOS 9 系统

### 允许 http 请求

默认配置下，iOS 9 会拦截 http 协议的请求，并打印如下一行文字：

```
App Transport Security has blocked a cleartext HTTP (http://) resource load since it is insecure. Temporary exceptions can be configured via your app's Info.plist file.
```

问题是，大部分社交平台接口都使用 http 协议。而且，应用中也可能需要访问 http 协议的接口。

有一个简单粗暴的解决办法就是，允许所有的 http 请求：

1. 在项目的 info.plist 文件中添加一个字段：NSAppTransportSecurity，值为字典类型
2. 然后再在这个字典中添加一个字段：NSAllowsArbitraryLoads，值为 YES

### 添加 Scheme 白名单

许多社交平台登录都需要跳转到它们的应用中进行，但是iOS 9 对 `canOpenURL:` 接口做了限制，导致许多社交平台的 SDK 无法正常跳转到对应的应用中进行分享。

解决办法如下：

1. 在项目的 info.plist 中添加一个字段：LSApplicationQueriesSchemes，值类型为 Array
2. 然后在这个数组中添加需要支持的 scheme，各平台的 scheme 列表如下：
	
	平台	|  scheme
	-------|----------
	Facebook|fbauth2
	Twitter| 无需配置
	新浪微博|sinaweibo,<br>sinaweibohd,<br>sinaweibosso,<br>sinaweibohdsso,<br>weibosdk,<br>weibosdk2.5
	微信	| wechat, <br>weixin
	QQ		| mqqOpensdkSSoLogin,<br>mqqopensdkapiV2,<br>mqqopensdkapiV3,<br>wtloginmqq2,<br>mqq,<br>mqqapi
	QQ空间	| mqzoneopensdk, <br>mqzoneopensdkapi, <br>mqzoneopensdkapi19, <br>mqzoneopensdkapiV2, <br>mqqOpensdkSSoLogin, <br>mqqopensdkapiV2, <br>mqqopensdkapiV3, <br>wtloginmqq2, <br>mqqapi, <br>mqqwpa，<br>mqzone，<br>mqq<br>**注：若同时使用QQ和QQ空间，则只添加本格中的即可**

如果没有把平台的 scheme 添加到白名单中，系统会打印如下文字信息：

```
-canOpenURL: failed for URL: “sinaweibohdsso://xxx” – error: “This app is not allowed to query for scheme sinaweibohdsso”
```

按照上述方法，把 `sinaweibohdsso` 加入白名单即可。

## FAQ

[maxleap_console]: https://maxleap.cn

[set up a facebook app]: https://developers.facebook.com/apps

[getting started with the facebook sdk]: https://developers.facebook.com/docs/getting-started/facebook-sdk-for-ios/

[facebook permissions]: https://developers.facebook.com/docs/reference/api/permissions/

[facebook sdk reference]: https://developers.facebook.com/docs/reference/ios/current/

[set up twitter app]: https://dev.twitter.com/apps

[twitter documentation]: https://dev.twitter.com/docs

[twitter rest api]: https://dev.twitter.com/docs/api


[weibo_develop_site]: http://open.weibo.com/
[set up weibo app]: http://open.weibo.com/apps/new?sort=mobile
[weibo documentation]: http://open.weibo.com/wiki/%E9%A6%96%E9%A1%B5

[wechat_develop_site]: https://open.weixin.qq.com
[wechat documentation]: https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&lang=zh_CN

[open_qq_site]: http://open.qq.com/
[set_up_qq_app]: http://op.open.qq.com/appregv2/
[qq_documentation]: http://wiki.open.qq.com/wiki/IOS_API%E8%B0%83%E7%94%A8%E8%AF%B4%E6%98%8E
