# 社交分享

## 简介

目前支持分享到新浪微博、微信好友、微信朋友圈、QQ好用、QQ空间。

## 使用

### 集成

1. 使用 `cocoapods` 安装

	在 `Podfile` 中加上下面这行：

	```
	pod 'MaxSocialShare'
	```

	打开应用 `终端`，执行以下命令:

	```
	$ cd your_project_dir
	$ pod install
	```

2. 手动安装
	
	1. [下载最新版本的 MaxSocialShare SDK](https://github.com/MaxLeap/SDK-iOS/releases)
	
	2. 解压后得到 `MaxSocialShare.framework` 和 `PlatformSDK` 文件夹，将它们拖到到项目中。其中 `PlatformSDK` 文件夹中是各平台的官方 SDK，是可选的。
	
	3. 添加依赖库
		
		CoreTelephony<br>
		SystemConfiguration<br>
		libsqlite3<br>
		libc++<br>
		libz
		
		ImageIO (Weibo SDK 依赖)

### 认证说明

MaxLeap 中用一个用户系统，可以使用第三方登录，认证信息保存在 `MLUser` 中。

MaxSocialShare 不依赖于 MaxLeap, 不会自动使用 `MLUser` 中的第三方平台认证信息，也不会保存分享过程中的认证信息。

### 初始化分享环境

#### 初始化新浪微博分享环境：

如果集成了 MaxLeap 微博登录模块 `MLWeiboUtils.framework`，启动代码中应该包含了下面这行代码：

```
[MLWeiboUtils initializeWeiboWithAppKey:@"your_weibo_appKey" redirectURI:@"https://api.weibo.com/oauth2/default.html"];
```

调用这行代码以后，新浪微博分享环境已经初始化，无需另外配置。

如果没有集成微博登录模块，则需要下面这行代码来初始化：

```
[WeiboSDK registerApp:@"your_weibo_appKey"];
// MaxSocialShare 认证时会使用默认的 `redirectUrl`， https://api.weibo.com/oauth2/default.html
```

#### 初始化腾讯 QQ 分享环境：

如果集成了 MaxLeap 微博登录模块 `MLQQUtils.framework`，启动代码中应该包含了下面这行代码：

```
[MLQQUtils initializeQQWithAppId:@"222222" qqDelegate:self];
```

调用这行代码以后，新浪微博分享环境已经初始化，无需另外配置。

如果没有集成微博登录模块，则需要下面这行代码来初始化：

```
TencentOAuth *oauth = [[TencentOAuth alloc] initWithAppId:@"your_tecent_appId" andDelegate:delegate];
// 这个 oauth 对象会作用于全局，需要一直存在
```

#### 初始化微信分享环境：

如果集成了 MaxLeap 微博登录模块 `MLWeChatUtils.framework`，启动代码中应该包含了下面这行代码：

```
[MLWeChatUtils initializeWeChatWithAppId:@"wx_appId" appSecret:@"wx_app_secret" wxDelegate:self];
```

调用这行代码以后，新浪微博分享环境已经初始化，无需另外配置。

如果没有集成微博登录模块，则需要下面这行代码来初始化：

```
[WXApi registerApp:@"your_wx_appId"];
```

### 分享内容

- 分享文本

	```
	MLShareItem *textItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeText];
    textItem.title = @"文字标题"; // optional, 目前 QQ, 微信，微博 都不支持
    textItem.detail = @"文字内容"; // required
    [MaxSocialShare shareItem:textItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```

- 分享图片

	```
	MLShareItem *imageItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeImage];
	imageItem.attachmentURL = imageUrl; // required
    
    imageItem.title = @"图片标题"; // optional, 只有腾讯支持
    imageItem.detail = @"图片描述"; // optional, 只有腾讯支持
	imageItem.previewImageData = preview; // optional, 预览图
    [MaxSocialShare shareItem:imageItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
	
- 分享网页

	```
	MLShareItem *webpageItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeWebpage];
    webpageItem.title = @"网页标题";
    webpageItem.detail = @"网页描述";
    webpageItem.webpageURL = [NSURL URLWithString:@"网页地址"];
	webpageItem.previewImageData = previewImageData; // 预览图
    [MaxSocialShare shareItem:webpageItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
	
- 分享音乐

	```
	MLShareItem *musicItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeMusic];
    musicItem.title = @"音乐标题";
    musicItem.detail = @"音乐描述";
	musicItem.previewImageData = previewImageData; // 预览图
    musicItem.webpageURL = [NSURL URLWithString:@"音乐网页地址"];
    musicItem.attachmentURL = [NSURL URLWithString:@"音乐数据流地址"];
    [MaxSocialShare shareItem:musicItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
	
- 分享视频

	```
	MLShareItem *videoItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeVideo];
    videoItem.title = @"视频标题";
    videoItem.detail = @"视频描述";
	videoItem.previewImageData = previewImageData; // 预览图像
    videoItem.webpageURL = [NSURL URLWithString:@"视频网页地址"];
    videoItem.attachmentURL = [NSURL URLWithString:@"视频数据流地址"];
    [MaxSocialShare shareItem:videoItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
