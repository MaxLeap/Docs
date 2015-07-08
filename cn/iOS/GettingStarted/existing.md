---
title: Quick Start | LAS

language_tabs:
  - objc
  - swift

search: true
---

# 安装SDK

1. 下载&解压缩SDK

		请确认您使用的是Xcode最新版本（5.0+），目标平台为iOS 6.0 及之后的版本。

		<a class="download-sdk" href="https://raw.githubusercontent.com/LeapAppServices/LAS-SDK-Release/master/iOS/v1.5.0/LASAll-v1.5.0.zip">下载SDK</a>

2. 添加SDK到您的应用

	将下载的LAS.framework拖至Xcode项目目标文件夹下。确保已勾选“Copy items to destination’s group folder”的复选框。
	
	<p class="image-wrapper">
	![](/images/drag_sdk_to_project.png)

3. 添加依赖

	点击Targets→应用名→“Build Phases”栏。</br>
	将“Link Binary With Libraries”如下图展开。
	
	<p class="image-wrapper">
	![](/images/add_dependencies.png)
	
    确保“Enable Modules (C and Objective-C)” 和 “Link Frameworks Automatically”的生成设置为Yes。
    
    <p class="image-wrapper">
    ![](/images/enable_modules.png)
    
	点击“Link Binary With Libraries”左下角+号按钮，添加下列数据包：
	
	MobileCoreServices.framework</br>
	CoreTelephony.framework</br>
	SystemConfiguration.framework</br>
	libsqlite3.dylib</br>

# 连接您的App到LAS服务器

打开AppDelegate.m文件，并将如下import添加到文件顶部：

```objc
#import <LAS/LAS.h>
```

开始前，请先从右边菜单选择您的LAS应用。上述这些步骤是为您的应用“Test”准备的。

然后将以下代码复制到 application:didFinishLaunchingWithOptions: 方法中：

```objc
[LAS setApplicationId:@"your_application_id" clientKey:@"your_client_id"];
```

编译并运行！


# 测试SDK

首先，确保您已经在您的.h文件中引入了我们的SDK库：

```objc
#import <LAS/LAS.h>
```

然后拷贝以下代码至您的应用，例如viewDidLoad方法（或运行应用时调用的另一方法）：

```objc
LASObject *testObject = [LASObject objectWithClassName:@"TestObject"];
testObject[@"foo"] = @"bar";
[LASDataManager saveObjectInBackground:testObject block:nil];
```

运行应用。一个新的 TestObject 对象将会被发送到并保存LAS服务器。一切就绪后，请点击下面的按钮检测您的数据是否已被发送。

当您完成上述所有步骤后，您可以到DashBoard>Cloud Data栏查看我们刚刚定义的新数据。
