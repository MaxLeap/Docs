
## 安装SDK

1. 下载模板项目并解压

	请确保您使用的是最新的 Xcode (v7.0+), 并且目标平台版本为 iOS 6.0 或者更高。
	
	<a class="download-sdk" href="https://github.com/MaxLeap/StarterProject-iOS" target="_blank">下载模板项目</a>

2. 配置项目

	在运行之前，还要进行一些配置：
	
	打开模板项目的 `AppDelegate.m` 文件，取消 `application:didFinishLaunchingWithOptions:` 中像下面这行的注释:
	
	```objc
	[MaxLeap setApplicationId:@"your_application_id" clientKey:@"your_client_key" site:MLSiteCN];
	```
	
	请把 `your_application_id` 和 `your_client_key` 替换成您自己应用的。最后一个参数 site 目前有两个值：`MLSiteUS` 对应 https://maxleap.com, `MLSiteCN` 对应 https://maxleap.cn。

3. 现在可以运行了。


## 测试项目配置

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
至此，您已经完成MaxLeap SDK的安装与必要的配置。请移步至[iOS SDK使用教程](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS)以获取MaxLeap的详细功能介绍以及使用方法，开启MaxLeap云服务使用之旅。