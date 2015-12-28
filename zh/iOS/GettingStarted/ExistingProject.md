## 安装SDK

### 使用 CocoaPods

CocoaPods 是一个很好用的依赖管理工具，可以简化安装过程。

在 Podfile 中添加：

```
pod "MaxLeap"

# 如果使用 HelpCenter，需添加
pod "MLHelpCenter"

# 如果使用需要连接 Facebook，并使用的是 FacebookSDK v3.x，则添加
pod "MLFacebookUtils"
# 如果使用的是 FacebookSDK v4.x 版本，则添加
pod "MLFacebookUtilsV4"

# 如果需要连接 Twitter，需添加
pod "MLTwitterUtils"
```

然后再项目根目录执行 `pod install` 命令，就能将 MaxLeap SDK 集成到你的项目中。

### 手动安装

1. 下载并解压缩 SDK

	请确认您使用的是Xcode最新版本（7.0+），目标平台为iOS 6.0 或者更高版本。

	<a class="download-sdk" href="https://github.com/MaxLeap/SDK-iOS/releases" target="_blank">下载 SDK</a>

2. 添加 SDK 到您的应用

	将下载的 `MaxLeap.framework` 拖至Xcode项目目标文件夹下。确保已勾选“Copy items to destination’s group folder”的复选框。
	
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

## 连接云端应用

打开 `AppDelegate.m` 文件，并将如下import添加到文件顶部：

```objc
#import <MaxLeap/MaxLeap.h>
```

然后将以下代码复制到 `application:didFinishLaunchingWithOptions:` 方法中：

```objc
[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_id" site:MLSiteCN];
```

请把 `your_application_id` 和 `your_client_id ` 替换成您自己的 MaxLeap 应用的。同时根据您应用平台的地区，设置服务器位置（`MLSiteUS`, `MLSiteCN`）。

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

## 下一步
 至此，您已经完成MaxLeap SDK的安装与必要的配置。请移步至[iOS SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS)以获取MaxLeap的详细功能介绍以及使用方法，开启MaxLeap云服务之旅。
