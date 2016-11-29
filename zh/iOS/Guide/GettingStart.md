# SDK 集成

## 新项目集成

1. 下载模板项目并解压

	请确保你使用的是最新的 Xcode (v7.0+), 并且目标平台版本为 iOS 7.0 或者更高。
	
	<a class="download-sdk" href="https://github.com/MaxLeap/StarterProject-iOS/archive/master.zip" target="_blank">下载模板项目</a>

2. 配置项目

	在运行之前，还要进行一些配置：
	
	打开模板项目的 `AppDelegate.m` 文件，取消 `application:didFinishLaunchingWithOptions:` 中像下面这行的注释:
	
	```objc
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];
	```
	
	请把 `your_application_id` 和 `your_client_key` 替换成你自己应用的。最后一个参数 site 目前有两个值：`MLSiteUS` 对应 https://maxleap.com, `MLSiteCN` 对应 https://maxleap.cn。

3. 现在可以运行了。

4. [接下来测试配置是否正确](#connection_test)

## 已有项目集成

### 使用 CocoaPods

[CocoaPods](https://guides.cocoapods.org/) 是 Objective-C 的依赖管理工具，现在已经支持 swift，它可以使第三方类库集成工作自动化，大大简化了这些工作。可以查看 [CocoaPods 入门指南](https://guides.cocoapods.org/using/getting-started.html)来进一步了解它。

在 Podfile 中合适的位置添加：

```ruby
# MaxLeap 核心 SDK
pod "MaxLeap/Core"
    
# 微信登录
pod "MaxLeap/WeChatUtils"
    
# 微博登录
pod "MaxLeap/WeiboUtils"
    
# QQ 登录
pod "MaxLeap/QQUtils"
    
# 支付（支持微信，支付宝和银联三个支付渠道）
# 2.2.0 之前版本，银联支付和支付宝支付SDK都需要另外安装
# 2.2.0 之后版本，银联支付 SDK 需要另外安装
pod "MaxLeap/Pay"
    
# 应用内社交
pod "MaxLeap/Social"
```

然后再项目根目录执行 `pod install` 命令，就能将 MaxLeap SDK 集成到你的项目中。

### 手动安装

1. 下载并解压缩 SDK

	请确认你使用的是Xcode最新版本（7.0+），目标平台为 iOS 7.0 或者更高版本。
[下载 SDK](https://s3.cn-north-1.amazonaws.com.cn/docs.maxleap.cn/iOS/latest/maxleap-sdk-ios-latest.zip)

2. 添加 SDK 到你的应用

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

请把 `your_application_id` 和 `your_client_id ` 替换成你自己的 MaxLeap 应用的。最后一个参数 site 目前有两个值：`MLSiteUS` 对应 https://maxleap.com, `MLSiteCN` 对应 https://maxleap.cn。

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
        } else if (error && error.code < kMLErrorInternalServer) {
            NSLog(@"未知错误： %@", error);
        } else if (error && error.code == kMLErrorInternalServer) {
            NSLog(@"服务器出错： %@", error);
        } else if (error && error.code == kMLErrorConnectionFailed) {
            NSLog(@"网络错误： %@", error);
        } else {
            NSLog(@"应用访问凭证不正确，请检查。");
        }
	}];
}
```

运行你的应用。然后查看 Xcode console 中打印的日志。
