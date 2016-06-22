# 社交分享


## 简介

目前支持分享到新浪微博、微信好友、微信朋友圈、QQ好用、QQ空间。还支持扩展自定义的分享按钮。

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
	
	1. [下载最新版本的 MaxSocialShare SDK](https://github.com/MaxLeap/Module-MaxShare-iOS/releases)
	
	2. 解压后得到 `MaxSocialShare.framework` 和 `PlatformSDK` 文件夹，将它们拖到到项目中。其中 `PlatformSDK` 文件夹中是各平台的官方 SDK，是可选的。
	
	3. 添加依赖库
		
		CoreTelephony<br>
		SystemConfiguration<br>
		libsqlite3<br>
		libc++<br>
		libz
		
		ImageIO (Weibo SDK 依赖)

	4. 在 Target -> Build Settings -> Other Link Flags 中加上 `-ObjC`

### 认证说明

MaxLeap 中用一个用户系统，可以使用第三方登录，认证信息保存在 `MLUser` 中。

MaxSocialShare 不依赖于 MaxLeap, 不会自动使用 `MLUser` 中的第三方平台认证信息，也不会保存分享过程中的认证信息。

### 初始化分享环境

#### 初始化新浪微博分享环境：

首先需要前往[微博开放平台][weibo_develop_site]，[创建微博应用][set up weibo app]。

**重要：**在 `微博应用 >> 应用信息 >> 高级信息` 中填写自己应用的 bundleID

**重要：**在 `微博应用 >> 应用信息 >> 高级信息` 中仔细填写授权回调页和取消授权回调页地址。这个地址在集成微博 SDK 的时候需要用到。

如果集成了 MaxLeap 微博登录模块 `MLWeiboUtils.framework`，启动代码中应该包含了下面这行：

```
[MLWeiboUtils initializeWeiboWithAppKey:@"your_weibo_appKey" redirectURI:@"https://api.weibo.com/oauth2/default.html"];
```

调用这行代码以后，新浪微博分享环境已经初始化。

如果没有集成微博登录模块，则需要下面这行代码来初始化：

```
[WeiboSDK registerApp:@"your_weibo_appKey"];
// MaxSocialShare 认证时会使用默认的 `redirectUrl`: https://api.weibo.com/oauth2/default.html
```

#### 初始化腾讯 QQ 分享环境：

首先需要前往[腾讯开放平台][open_qq_site]，[创建 QQ 应用][set_up_qq_app]。

如果集成了 MaxLeap 微博登录模块 `MLQQUtils.framework`，启动代码中应该包含了下面这行：

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

首先需要前往[微信开放平台][wechat_develop_site]，创建微信移动应用。

如果集成了 MaxLeap 微博登录模块 `MLWeChatUtils.framework`，启动代码中应该包含了下面这行代码：

```
[MLWeChatUtils initializeWeChatWithAppId:@"wx_appId" appSecret:@"wx_app_secret" wxDelegate:self];
```

调用这行代码以后，新浪微博分享环境已经初始化，无需另外配置。

如果没有集成微博登录模块，则需要下面这行代码来初始化：

```
[WXApi registerApp:@"your_wx_appId"];
```

### iOS 9 适配

#### 允许 http 请求

默认配置下，iOS 9 会拦截 http 协议的请求，并打印如下一行文字：

```
App Transport Security has blocked a cleartext HTTP (http://) resource load since it is insecure. Temporary exceptions can be configured via your app's Info.plist file.
```

问题是，大部分社交平台接口都使用 http 协议。而且，应用中也可能需要访问 http 协议的接口。

有一个简单粗暴的解决办法就是，允许所有的 http 请求：

1. 在项目的 info.plist 文件中添加一个字段：NSAppTransportSecurity，值为字典类型
2. 然后再在它下面添加一个字段：NSAllowsArbitraryLoads，值为 YES

#### 添加 Scheme 白名单

许多社交平台分享都需要跳转到它们的应用中进行，iOS 9 对 `canOpenURL:` 接口做了限制，导致许多社交平台的 SDK 无法正常跳转到对应的应用中进行分享。

解决办法如下：

1. 在项目的 info.plist 中添加一个字段：LSApplicationQueriesSchemes，值类型为 Array
2. 然后在这个数组中添加需要支持的 scheme，各平台的 scheme 列表如下：
	
	平台	|  scheme
	-------|----------
	新浪微博|sinaweibo,<br>sinaweibohd,<br>sinaweibosso,<br>sinaweibohdsso,<br>weibosdk,<br>weibosdk2.5
	微信	| wechat, <br>weixin
	QQ		| mqqOpensdkSSoLogin,<br>mqqopensdkapiV2,<br>mqqopensdkapiV3,<br>wtloginmqq2,<br>mqq,<br>mqqapi
	QQ空间	| mqzoneopensdk, <br>mqzoneopensdkapi, <br>mqzoneopensdkapi19, <br>mqzoneopensdkapiV2, <br>mqqOpensdkSSoLogin, <br>mqqopensdkapiV2, <br>mqqopensdkapiV3, <br>wtloginmqq2, <br>mqqapi, <br>mqqwpa，<br>mqzone，<br>mqq<br>**注：若同时使用QQ和QQ空间，则只添加本格中的即可**

如果没有把平台的 scheme 添加到白名单中，系统会打印如下文字信息：

```
-canOpenURL: failed for URL: “sinaweibohdsso://xxx” – error: “This app is not allowed to query for scheme sinaweibohdsso”
```

按照上述方法，把 `sinaweibohdsso` 加入白名单即可。

### 分享内容

**注意: 腾讯 QQ 分享和微信分享需要安装相应的客户端，否则分享按钮不会出现。**

分享需要创建一个 `MLShareItem` 对象，然后设置类型和相关数据。再按下分享按钮时，不受支持的数据会被忽略。

#### 分享接口说明

```
+ (void)shareItem:(MLShareItem *)item
    withContainer:(nullable MaxSocialContainer *)container
       completion:(MLSActivityViewControllerCompletionBlock)block;
```

该接口有三个参数：</br>
	
- **`item`**: 要分享的内容
- **`container`**: iPad 会使用这个参数让分享界面以 popover 的形式弹出来
- **`block`**: 用户按下分享按钮后，调用对应平台分享接口的情况，并不是分享结果

使用方法：
	
```
// 创建一个 MLShareItem 对象
MLShareItem *item = [MLShareItem itemWithMediaType:MLSContentMediaTypeText];
item.title = @"title";
item.detail = @"detail";
    
// 创建一个 MaxSocialContainer 对象
// 如果不需要支持 iPad，可以为空
MaxSocialContainer *container = [MaxSocialContainer containerWithBarButtonItem:sender];
[MaxSocialShare shareItem:item withContainer:container completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
    if (completed) {
        // 调用分享接口成功
    } else {
        // ...
    }
}];
```

#### 分享示例

**注意:** 微信 SDK 限制缩略图大小为不超过 32k，如果点击微信按钮后得到`分享失败`的错误提示，请检查相关数据的规格是否合乎微信 SDK 的要求。更多信息请查阅[微信开发者须知](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419318037&token=&lang=zh_CN)

- 分享文本

	```
	MLShareItem *textItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeText];
    // textItem.title = @"文字标题"; // optional, 目前 QQ, 微信，微博 都不支持
    textItem.detail = @"文字内容"; // required
    [MaxSocialShare shareItem:textItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```

- 分享图片

	```
	MLShareItem *imageItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeImage];
	imageItem.attachmentURL = imageUrl; // required，支持 fileURL 和 远程图片链接
    
    imageItem.title = @"图片标题"; // optional, 只有QQ支持
    imageItem.detail = @"图片描述"; // optional, 只有QQ支持
	imageItem.previewImageData = preview; // optional, 只有QQ支持
	
    [MaxSocialShare shareItem:imageItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
	
- 分享网页

	```
	MLShareItem *webpageItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeWebpage];
	
	// 腾讯，微博，微信都支持以下字段
    webpageItem.title = @"网页标题";
    webpageItem.detail = @"网页描述";
    webpageItem.webpageURL = [NSURL URLWithString:@"网页地址"];
	webpageItem.previewImageData = previewImageData; // 预览图, 微信限制不大于 32k
	
    [MaxSocialShare shareItem:webpageItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
	
- 分享音乐

	```
	MLShareItem *musicItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeMusic];
	
    musicItem.title = @"音乐标题";
    musicItem.detail = @"音乐描述";
	musicItem.previewImageData = previewImageData; // 预览图, 微信限制不大于 32k
    musicItem.attachmentURL = [NSURL URLWithString:@"音乐数据流地址"];
    
    musicItem.webpageURL = [NSURL URLWithString:@"音乐网页地址"]; // 微博，微信支持，QQ不支持
    
    [MaxSocialShare shareItem:musicItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```
	
- 分享视频

	```
	MLShareItem *videoItem = [MLShareItem itemWithMediaType:MLSContentMediaTypeVideo];
	
	// 以下字段三个平台都支持
    videoItem.title = @"视频标题";
    videoItem.detail = @"视频描述";
	videoItem.previewImageData = previewImageData; // 预览图像，微信限制不大于 32k
	
	// 微信，微博支持，QQ 不支持
    videoItem.webpageURL = [NSURL URLWithString:@"视频网页地址"];
    // QQ, 微博支持，微信不支持
    videoItem.attachmentURL = [NSURL URLWithString:@"视频数据流地址"];
    
    [MaxSocialShare shareItem:videoItem completion:^(MLSActivityType activityType, BOOL completed, NSError * _Nullable activityError) {
        NSLog(@"share activity (%d) completed: %d", activityType, completed);
    }];
	```

## 扩展

`MaxSocialShare` 支持类似 `UIActivityViewController` 的扩展方法，可以添加框架现在不支持的平台分享按钮。

扩展通过继承 `MLSActivity` 来完成。下面我们写一个自定义的分享按钮：

`CustomActivity.h` 文件:

```
#import <MaxSocialShare/MaxSocialShare.h>

@interface CustomActivity : MLSActivity

@end
```

`CustomActivity.m` 文件:

```
#import "CustomActivity.h"

// 定义 custom type，注意值不要和已有的重复了
MLSActivityType MLSActivityTypeCustom = 6;

@implementation CustomActivity

+ (MLSActivityType)type {
    // 返回 CustomActivity 的类型，如果之前已经注册了跟 MLSActivityTypeCustom 类型值相同的 activity，则会覆盖它
    return MLSActivityTypeCustom;
}

+ (BOOL)canPerformWithActivityItem:(MLShareItem *)activityItem {
    // 检查 activityItem 来判断是否能处理它
    return YES;
}

- (nullable NSString *)title {
    // 分享按钮的标题
    return @"Custom";
}

- (nullable UIImage *)image {
    // 分享按钮的图片
    return [UIImage imageNamed:@"custom_share_btn_icon"];
}

- (void)prepareWithActivityItem:(MLShareItem *)activityItem {
    // 在这个方法里面对 activityItem 做一些预处理操作
}

- (void)perform {
    // 做具体的分享操作
    
    // 重要，操作完成后一定要调一下这个方法，传入错误表示分享操作失败，传入 nil 表示分享成功
    [self activityDidFinishWithError:nil];
}

@end
```

**重要：**最后一步操作：注册 `CustomActivity`

```
[MLSActivity registerActivityClass:[CustomActivity class]];
```

推荐把这行代码写到 `CustomActivity` 类的 `+load` 方法中，这样，当 `CustomActivity` 类加载时，就会自动注册。

```
@implementation CustomActivity

+ (void)load {
    [MLSActivity registerActivityClass:[CustomActivity class]];
}

@end
```


[maxleap_console]: https://maxleap.cn

[weibo_develop_site]: http://open.weibo.com/
[set up weibo app]: http://open.weibo.com/apps/new?sort=mobile

[wechat_develop_site]: https://open.weixin.qq.com

[open_qq_site]: http://open.qq.com/
[set_up_qq_app]: http://op.open.qq.com/appregv2/

