
##	安装SDK

1. 下载模板项目并解压

	请确保您使用的是最新的 Xcode (v7.0+), 并且目标平台版本为 iOS 6.0 或者更高。

	<a class="download-sdk" href="https://github.com/MaxLeap/Demo-Support-iOS" target="_blank">下载模板项目</a>

2. 连接 MaxLeap 云端应用

	在运行之前，还要进行一些配置：

	打开模板项目的 `AppDelegate.m` 文件，取消 `application:didFinishLaunchingWithOptions:` 中像下面几行的注释:

	```objc
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];
	[MLHelpCenter install];
	```

	请把 `your_application_id` 和 `your_client_key` 替换成您自己应用的。同时根据您应用平台的地区，设置服务器位置（`MLSiteUS`, `MLSiteCN`）。
    
3. 现在可以运行了。
    
    
## 测试项目配置

1. 检测是否可以连接到 MaxLeap 云端应用

在 `appDelegate.m` 的 `application:didFinishLaunchingWithOptions:` 方法中加入以下代码：


	```objc
	#import <MaxLeap/MaxLeap.h>
	#import <MLHelpCenter/MLHelpCenter.h>
	
	- (BOOL)application:(UIApplication *)application 	didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
	{
	[MaxLeap setApplicationId:@"your_application_id" 	clientKey:@"your_client_key" site:MLSiteCN];
	[MLHelpCenter install];

	// 创建一条数据
	MLObject *testObject = [MLObject objectWithClassName:@"Person"];
	testObject[@"foo"] = @"bar";
	[testObject saveInBackgroundWithBlock:nil];
	```

	这段代码试图在云端创建一条类名为 `Person` 的数据。如果云端还没有 `Person` 这个类，则会先创建这个类，然后再插入数据。

	运行您的应用。然后可以在 Dev Center -> Data 中看到刚创建的数据。

	![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)

2. 检测 HelpCenter 模块是否可以正常使用：
	
	在 `ViewController.m` 的 `viewDidAppear:` 方法中添加以下代码：

	```
	[[MLHelpCenter sharedInstance] showFAQs:self];
	```

	运行配置好的模板项目，您会看到以下界面：

	![ios_faq_view](../../../images/ios_faq_view.png)

	新应用的 FAQ 会自动创建 通用(General)、支付(Billing)、隐私(Privacy) 三个部分，如果此界面中显示这三个部分，说明与云端应用 FAQ 连接正常。

	在 FAQ 界面右上角有一个`反馈`按钮，按下这个按钮会进入应用反馈界面，如下：

	![ios_new_conversation_view](../../../images/ios_new_conversation_view.png)

	接下来填写问题简要描述和名字，点击右上角`发送`按钮就会把消息发送到服务器了。发送完成后会收到一条自动回复，这说明 HelpCenter 模块已经集成好了。

	![ios_issue_message_view](../../../images/ios_issue_message_view.png)

	在 [MaxLeap 开发者平台](https://maxleap.cn)上的 `Support >> App Issues >> New Issues` 中可以看到这条反馈。

## 下一步

至此，HelpCenter SDK的安装与配置完成。请移步至[HelpCenter SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#SUPPORT_ZH)以获取HelpCenter的详细功能介绍以及使用方法，开启MaxLeap云服务使用之旅。