# iOS 快速入门

## 创建应用
MaxLeap 提供两种模式创建应用
### 自定义应用
用户自行创建工程项目并配置，根据具体业务设计数据库表结构和对应逻辑。

1、点击创建应用后，进入如下页面，输入应用名称并选择自定义应用，然后点击创建按钮
![](../../../images/CreateAppCustom1.png)
2、点击创建按钮后，应用创建成功，如果下图所示，可以应用相关密钥信息、移动端新手指南入口和我的应用列表入口

新手指南如下：[iOS 新手指南 ](https://maxleap.cn/s/web/zh_cn/quickstart/ios/core/new.html) ，[Android 新手指南 ](https://maxleap.cn/s/web/zh_cn/quickstart/android/core/new.html) ，[React Native 新手指南 ](https://maxleap.cn/s/web/zh_cn/quickstart/android/core/new.html) 

![](../../../images/CreateAppCustom2.png)
### 模板应用
直接基于 MaxLeap 提供的模板应用快速开发，模板应用包括配置好的移动端工程项目、后端工程项目（视具体模板应用而定，不一定都有）以及云端初始化数据，您可以基于模板应用开发您的应用。


1、点击创建应用，并输入用户名，下面选择模板应用
![](../../../images/CreateAppTemp2.png)
2、模板应用可以查看详情或者立即根据此模板创建，点击查看详情进入如下UI
![](../../../images/CreateAppTemp3.png)
3、点击立即使用后，MaxLeap 会自动生成配置好的移动端工程项目、后端工程项（视具体模板应用而定，不一定都有）和后端初始化云数据
![](../../../images/CreateAppTemp4.png)
4、生成好以后，您可以下载项目工程，里面包括：iOS、Android、ReactNative 等移动端工程，如果有后端工程项目（视具体模板应用而定），也会包含
![](../../../images/CreateAppTemp5.png)
5、可以直接进入我的应用列表页面查看刚创建好的应用
![](../../../images/CreateAppTemp6.png)
6、点击开发选择进入开发中心云数据库查看云端初始化数据
![](../../../images/CreateAppTemp8.png)
7、工程项目下载完成后解压出工程项目（以 iOS 为例）并导入Xcode，直接运行即可查看模板应用，AppId 和 ClientKey 已经自动配置完成
![](../../../images/createApp12.png)
8、可以在应用设置下的应用密钥中查看应用的相关key，包括 AppId 和 ClientKey 等
![](../../../images/CreateAppTemp7.png)

 Ok，是不是很简单呢，您可以直接基于我们的模板应用快速构建您自己的应用，Happy Coding!!!!
 
 ## 新项目集成

1. 下载模板项目并解压

	请确保您使用的是最新的 Xcode (v7.0+), 并且目标平台版本为 iOS 7.0 或者更高。
	
	<a class="download-sdk" href="https://github.com/MaxLeap/StarterProject-iOS/archive/master.zip" target="_blank">下载模板项目</a>

2. 配置项目

	在运行之前，还要进行一些配置：
	
	打开模板项目的 `AppDelegate.m` 文件，取消 `application:didFinishLaunchingWithOptions:` 中像下面这行的注释:
	
	```objc
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];
	```
	
	请把 `your_application_id` 和 `your_client_key` 替换成您自己应用的。最后一个参数 site 目前有两个值：`MLSiteUS` 对应 https://maxleap.com, `MLSiteCN` 对应 https://maxleap.cn。

3. 现在可以运行了。

4. [接下来测试配置是否正确](#connection_test)

## 已有项目集成

### 使用 CocoaPods

CocoaPods 是一个很好用的依赖管理工具，可以简化安装过程。

在 Podfile 中添加：

```
# MaxLeap 核心 SDK
pod "MaxLeap/Core"

# 微信登录
pod "MaxLeap/WeChatUtils"

# 微博登录
pod "MaxLeap/WeiboUtils"

# QQ 登录
pod "MaxLeap/QQUtils"

# 支付
pod "MaxLeap/Pay"

# 应用内支付
pod "MaxLeap/Social"
```

然后再项目根目录执行 `pod install` 命令，就能将 MaxLeap SDK 集成到你的项目中。

### 手动安装

1. 下载并解压缩 SDK

	请确认您使用的是Xcode最新版本（7.0+），目标平台为 iOS 7.0 或者更高版本。

	<a class="download-sdk" href="https://github.com/MaxLeap/SDK-iOS/releases" target="_blank">下载 SDK (maxleap-sdk-ios-*.zip)</a>

2. 添加 SDK 到您的应用

	将解压后文件夹中的 `MaxLeap.framework` 拖至Xcode项目目标文件夹下。确保已勾选“Copy items to destination’s group folder”的复选框。
	
	<p class="image-wrapper">
	![drag_sdk_to_project](../../../images/drag_sdk_to_project.png)

3. 添加依赖

	确保“Enable Modules (C and Objective-C)” 和 “Link Frameworks Automatically”的生成设置为Yes。
    
    <p class="image-wrapper">
    ![enable_modules](../../../images/enable_modules.png)

	点击 Targets → YourAppName → "Build Phases" 栏。</br>
	展开 “Link Binary With Libraries”，如下图：
	
	<p class="image-wrapper">
	![add_dependencies](../../../images/add_dependencies.png)
	
	点击“Link Binary With Libraries”左下角+号按钮，添加下列框架：
	
	MobileCoreServices.framework</br>
	CoreTelephony.framework</br>
	SystemConfiguration.framework</br>
	libsqlite3.dylib</br>
	libz.dylib</br>


<span id="connection_test"></span>
## 连接云端应用

打开 `AppDelegate.m` 文件，并将如下import添加到文件顶部：

```objc
#import <MaxLeap/MaxLeap.h>
```

然后将以下代码复制到 `application:didFinishLaunchingWithOptions:` 方法中：

```objc
[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_id" site:MLSiteCN];
```

请把 `your_application_id` 和 `your_client_id ` 替换成您自己的 MaxLeap 应用的。最后一个参数 site 目前有两个值：`MLSiteUS` 对应 https://maxleap.com, `MLSiteCN` 对应 https://maxleap.cn。

编译并运行！


## 测试是否可以连接到 MaxLeap 服务器

为了检测是否可以连接 MaxLeap 云服务和目标应用，我们可以在 `appDelegate.m` 的 `application:didFinishLaunchingWithOptions:` 方法中加入以下代码：

```objc
#import <MaxLeap/MaxLeap.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];

	MLObject *obj = [MLObject objectWithoutDataWithClassName:@"Test" objectId:@"561c83c0226"];
    [obj fetchIfNeededInBackgroundWithBlock:^(MLObject * _Nullable object, NSError * _Nullable error) {
    	if (error.code == kMLErrorInvalidObjectId) {
        	NSLog(@"已经能够正确连接上您的云端应用");
    	} else {
        	NSLog(@"应用访问凭证不正确，请检查。");
    	}
	}];
}
```

运行您的应用。然后查看 Xcode console 中打印的日志。

##下一步
至此，您已经完成MaxLeap SDK的安装与必要的配置。请移步至   [iOS SDK开用指南](https://webuat.maxleap.cn/s/web/zh_cn/guide/devguide/ios.html)以获取MaxLeap的详细功能介绍以及使用方法，开启MaxLeap云服务使用之旅。


