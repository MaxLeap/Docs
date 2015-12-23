
## 安装SDK

### 使用 CocoaPods

CocoaPods 是一个很好用的依赖管理工具，可以简化安装过程。

在 Podfile 中添加：

```
pod "MaxLeap"
pod "MLHelpCenter"
```

然后再项目根目录执行 `pod install` 命令，就能将 MaxLeap SDK 集成到你的项目中。

### 手动安装

1. 下载并解压缩 SDK

	请确认您使用的是 Xcode 最新版本（7.0+），目标平台为iOS 6.0 或者更高版本。

	<a class="download-sdk" href="https://github.com/MaxLeap/Demo-Support-iOS" target="_blank">下载模板项目</a>

2. 添加SDK到您的应用

	将下载的 `MaxLeap.framework` 拖至Xcode项目目标文件夹下。确保已勾选“Copy items to destination’s group folder”的复选框。
	
	<p class="image-wrapper">
	![drag_sdk_to_project](../../images/drag_sdk_to_project.png)

	按照同样的方法把 `MLHelpCenter.embeddedframework` 拖到 Xcode 项目中，这样做的目的是为了把 MLHelpCenter.framework 和相关的资源同时添加到项目中。**注意：不要**使用 `Link Binary With Libraris >> Add Others` 来添加这个框架。

3. 添加依赖

	确保“Enable Modules (C and Objective-C)” 和 “Link Frameworks Automatically”的生成设置为 YES。
    
    <p class="image-wrapper">
    ![enable_modules](../../images//enable_modules.png)

	点击 Targets → 应用名 → “Build Phases” 栏。</br>
	将 “Link Binary With Libraries” 如下图展开。
	
	<p class="image-wrapper">
	![add_dependencies](../../images//add_dependencies.png)
    
	点击 “Link Binary With Libraries” 左下角 + 号按钮，添加下列框架：
	
	StoreKit.framework</br>
	MobileCoreServices.framework</br>
	CoreTelephony.framework</br>
	SystemConfiguration.framework</br>
	libsqlite3.dylib</br>
	libz.dylib</br>

## 连接云端应用

打开 `AppDelegate.m` 文件，并添加如下头部：

```objc
#import <MaxLeap/MaxLeap.h>
```

然后将以下代码复制到 `application:didFinishLaunchingWithOptions:` 方法中：

```objc
[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_id"];
```

把 `your_application_id` 和 `your_client_id ` 替换成您自己的 MaxLeap 应用的。

接下来启用 `HelpCenter` 模块:

```
#import <MLHelpCenter/MLHelpCenter.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];
	[MLHelpCenter install];
}
```

请把 `your_application_id` 和 `your_client_id ` 替换成您自己的 MaxLeap 应用的。同时根据您应用平台的地区，设置服务器位置（`MLSiteUS`, `MLSiteCN`）。

编译并运行！

## 快速测试

1. 测试是否可以连接到 MaxLeap 服务器

	在 `appDelegate.m` 的 `application:didFinishLaunchingWithOptions:` 方法中加入以下代码：


	```objc
	#import <MaxLeap/MaxLeap.h>

	- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
	{
		[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];

		MLQuery *que = [MLQuery queryWithClassName:@"Test"];
		[que whereKey:@"objectId" equalTo:@"561c83c0226"];
		[que findObjectsInBackgroundWithBlock:^(NSArray *objects, NSError *error) {
		    if (error.code == 90000) {
    			// 返回错误代码为 90000 说明 appid, clientKey, site 配置正确。
	        	NSLog(@"已经能够正确连接上您的云端应用");
   			 } else {
	          NSLog(@"应用访问凭证不正确，请检查。");
    		 }
		}];
	}
	```

	运行您的应用。然后查看 Xcode console 中打印的日志。

2. 检测 HelpCenter 模块是否可以正常使用：
	
	在 `ViewController.m` 的 `viewDidAppear:` 方法中添加以下代码：
	
	```
	[[MLHelpCenter sharedInstance] showFAQs:self];
	```
	
	运行配置好的模板项目，您会看到以下界面：
	
	![ios_faq_view](../../images/ios_faq_view.png)
	
	新应用的 FAQ 会有 通用(General)、支付(Billing)、隐私(Privacy) 三个部分，如果此界面中显示这三个部分，说明与云端应用 FAQ 连接正常。
	
	在 FAQ 界面右上角有一个“反馈”按钮，按下这个按钮会进入应用反馈界面，如下：
	
	![ios_new_conversation_view](../../images/ios_new_conversation_view.png)
	
	接下来填写问题简要描述和名字，点击右上角“发送”按钮就会把消息发送到服务器了。发送完成后会收到一条自动回复，这说明 HelpCenter 模块已经集成好了。
	
	![ios_issue_message_view](../../images/ios_issue_message_view.png)
	
	在 MaxLeap 网站上的 Support -> App Issues -> New Issues 中可以看到这条反馈。

	## 下一步

    至此，HelpCenter SDK的安装与配置完成。请移步至[HelpCenter SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_ZH)以获取HelpCenter的详细功能介绍以及使用方法，开启MaxLeap云服务使用之旅。