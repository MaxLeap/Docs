
# 安装SDK

1. 下载模板项目并解压

	请确保您使用的是最新的 Xcode (v5.0+), 并且目标平台版本为 iOS 6.0 或者更高。

    <a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/iOS/v1.5.0/LASStarterProject.zip">下载模板项目</a>

2. 配置项目

	在运行之前，还要进行一些配置：
	
	打开模板项目的 `AppDelegate.m` 文件，取消 `application:didFinishLaunchingWithOptions:` 中像下面这行的注释:
    
    ```objc
    [LeapCloud setApplicationId:@"your_application_id" clientKey:@"your_client_key"];
    ```
    
    把 `your_application_id` 和 `your_client_key` 替换成您自己 app 的。
    
3. 现在可以运行了。
    
    
# 测试项目配置

为了检测是否可以连接 Leap Cloud 云服务和目标应用，我们可以在 `appDelegate.m` 的 `application:didFinishLaunchingWithOptions:` 方法中加入以下代码：


```objc
#import <LeapCloud/LeapCloud.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
[LeapCloud setApplicationId:@"your_application_id" clientKey:@"your_client_key"];

// 创建一条数据
LCObject *testObject = [LCObject objectWithClassName:@"Person"];
testObject[@"foo"] = @"bar";
[LCDataManager saveObjectInBackground:testObject block:nil];
```

这段代码试图在云端创建一条类名为 `Person` 的数据。如果云端还没有 `Person` 这个类，则会先创建这个类，然后再插入数据。

运行您的应用。然后可以在 Dev Center -> Data 中看到刚创建的数据。

![imgSDKQSTestAddObj](../../../images/imgSDKQSTestAddObj.png)