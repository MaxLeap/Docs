# 移动支付

## 简介

目前支持支付宝、微信、银联支付等渠道，支持支付及查询订单功能。我们将持续更新，支持更多支付平台和更多功能，敬请期待。

## 使用

### 填写各支付渠道信息

在集成 `MaxPay iOS SDK` 之前，请确保正确填写了将要集成的支付渠道的支付参数。

1. 创建 MaxLeap 应用
2. 打开支付渠道配置页面([MaxLeap 控制台](https://maxleap.cn) -> 支付管理 -> 渠道配置)，填写各支付渠道所需数据。

接下来集成 `MaxPay iOS SDK`, 请确保你使用的是 Xcode 6.4 或者更新版本。

### 使用 `cocoapods` 安装

在 `Podfile` 中加上下面这行:

```
pod 'MaxLeapPay'
```

打开应用 `终端`, 执行以下命令:

```
$ cd your_project_dir
$ pod install
```
	
### 手动安装

1. [下载并解压最新版本的 SDK](https://github.com/MaxLeap/SDK-iOS/releases)
2. 把解压得到的 `MaxLeap.framework` 和 `MaxLeapPay.framework` 拖到项目中 
3. 添加以下依赖库</br>
	`MobileCoreServices.framework`</br>
	`CoreTelephony.framework`</br>
	`SystemConfiguration.framework`</br>
	`libsqlite3.dylib`</br>
	`libz.dylib`</br>

4. 在 `application:didFinishLaunchingWithOptions:` 方法中加入以下代码，初始化 MaxLeap SDK：

	```
	[MaxLeap setApplicationId:@"your_maxleap_applicationId" clientKey:@"your_maxleap_clientKey" site:MLSiteCN];
	// 最后一个参数根据你账号所在大区填写，目前有中国区和美国区两个大区，它们之间数据不互通
	```

到这里 `MaxLeapPay.framework` 已经安装完成，但是所有的支付渠道应该都为不可用状态，因为还没有集成这些渠道对应的支付 SDK。

**集成各支付平台还需如下配置：**

1. 使用支付宝移动支付还需以下步骤：

	1. [下载并解压最新支付宝 SDK](https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.5TxcD7&treeId=59&articleId=103563&docType=1)
	2. 找到 `AliPay` 文件夹，该文件夹包含 `AliPaySDK.framework` 和 `AliPaySDK.bundle`，把该文件夹拖进项目中。
	3. 添加依赖 libc++.tbd

2. 微信移动支付需以下步骤：
	
	1. [下载并解压微信支付 SDK](https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=11_1)
	2. 找到微信 SDK 文件夹，该文件夹应包括 `libWeChatSDK.a`、`WXApi.h`、`WXApiObject.h`三个文件，把该文件夹拖进项目中。
	3. 添加依赖 libc++.tbd
	
3. 银联手机控件支付需要额外步骤：

	1. [下载并解压银联手机支付控件](https://open.unionpay.com/ajweb/help/file/techFile?productId=3)
	2. 找到 "UPPaymentControl" 文件夹，该文件夹包括 `libPaymentControl.a` 和 `UPPaymentControl.h` 两个文件，把该文件夹拖到项目中。
	3. 添加依赖 libc++.tbd

你可以设置支付环境，以用来测试。`MaxLeapPay` 提供了三种环境，Production(产品环境)、Sandbox(沙盒环境)、Offline(离线环境)。

沙盒环境和离线环境都可以用来测试，区别在于：沙盒环境会连接沙盒测试服务器，而离线环境不会连接服务器，只会使用一些模拟数据。

**注意：**不是所有渠道都支持沙盒环境和离线环境，如果某个渠道不支持当前环境，`+[MaxLeapPay isChannelAvaliable:]` 会返回 `NO`.

### 处理应用跳转回调

某些支付渠道需要跳转到相应平台应用中完成支付，`MaxLeapPay` 提供了统一的处理方法，

```
// iOS 4.2 -- iOS 8.4
// 如果需要兼容 iOS 6, iOS 7, iOS 8，需要实现这个代理方法
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {

    // 注意，这里由 `MaxLeapPay` 统一调用各支付平台 SDK 的 `handleOpenUrl:` 方法，可能与其他 SDK 的发生重复调用问题，请注意处理

    return [MaxLeapPay handleOpenUrl:url completion:^(MLPayResult * _Nonnull result) {
        // 支付应用结果回调，保证跳转支付应用过程中，即使调用方app被系统kill时，能通过这个回调取到支付结果。
    }];
}

// iOS 9.0 or later
// iOS 9 以及更新版本会优先调用这个代理方法，如果没有实现这个，则会调用上面那个
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:	(NSDictionary<NSString *,id> *)options {

    // 注意，这里由 `MaxLeapPay` 统一调用各支付平台 SDK 的 `handleOpenUrl:` 方法，可能与其他 SDK 的发生重复调用问题，请注意处理
    
    return [MaxLeapPay handleOpenUrl:url completion:^(MLPayResult * _Nonnull result) {
        // 支付应用结果回调，保证跳转支付应用过程中，即使调用方app被系统kill时，能通过这个回调取到支付结果。
    }];
}
```

### 使用支付宝支付

#### 支付宝移动支付

发起支付：

```
// 1. 生成订单
MLPayment *payment = [[MLPayment alloc] init];

// 设置使用 AliApp 渠道支付，该渠道会打开支付宝应用进行支付，如果没有安装支付宝应用，支付宝 SDK 会打开一个网页进行支付
payment.channel = MLPayChannelAliApp;

// 生成订单号，订单号要保证在商户系统中唯一
NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
[formatter setDateFormat:@"yyyyMMddHHmmssSSS"];
NSString *billNo = [formatter stringFromDate:[NSDate date]];
payment.billNo = billNo;

// 订单简要说明
payment.subject = @"测试";

// 总金额，单位：分
payment.totalFee = 0.01 * 100;

// 支付宝支付完成后通知支付结果时需要用到，没有固定格式，可以是 info.plist -> URL Types 中的任意一个 scheme
payment.scheme = @"maxleappaysample";

// 配置自定义字段
[payment.extraAttrs addEntriesFromDictionary:@{@"keyA":@"valueA"}];

// 2. 开始支付流程
[MaxLeapPay startPayment:payment completion:^(MLPayResult * _Nonnull result) {
    if (result.code == MLPaySuccess) {
        NSLog(@"支付成功");
    } else {
        NSLog(@"支付失败");
    }
}];
```

### 使用微信支付

#### 微信移动支付

1. 在Xcode中，选择你的工程设置项，选中“TARGETS”一栏，在“info”标签栏的“URL type“添加“URL scheme”为你所注册的应用程序id（如下图所示）。

	![drag_sdk_to_project](../../../images/pay_channel_wx_set_urlscheme.jpg)

2. 实现微信代理协议 `WXApiDelegate`：

	```
	@interface WXApiManager : NSObject <WXApiDelegate>
	@end
	
	@implementation WXApiManager
	
	- (void)onResp:(BaseResp*)resp {
		// 将 PayResponse 交给 MaxLeapPay 处理
	    if ([resp isKindOfClass:[PayResp class]]) {
	        [MaxLeapPay handleWXPayResponse:(PayResp *)resp];
	    }
	}
	@end
	```

3. 配置微信 SDK，在 `application:didFinishLaunchingWithOptions:`方法中，加入以下代码：

	```
	WXApiManager *wxDelegate = [[WXApiManager alloc] init];
	[MaxLeapPay setWXAppId:@"your_weixin_appId" wxDelegate:wxDelegate description:@"sample"];
	```

4. 发起支付：

	```
	// 1. 生成订单
	MLPayment *payment = [[MLPayment alloc] init];
	
	// 设置通过”微信移动支付“渠道支付，该支付方式目前要求必须安装有微信应用，否则无法使用
	payment.channel = MLPayChannelWxApp;
	
	// 生成订单号，订单号要保证在商户系统中唯一
	NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
	[formatter setDateFormat:@"yyyyMMddHHmmssSSS"];
	NSString *billNo = [formatter stringFromDate:[NSDate date]];
	payment.billNo = billNo;
	
	// 订单简要说明
	payment.subject = @"测试";
	
	// 总金额，单位：分
	payment.totalFee = 0.01 * 100;
	
	// 注意：这个值不需要设置，但是需要在 info.plist -> URL Types 中配置微信专用 URL Scheme, scheme 值为微信应用的 appId
	// payment.scheme = @"不需要设置";
	
	// 配置自定义字段
	[payment.extraAttrs addEntriesFromDictionary:@{@"keyA":@"valueA"}];
	
	
	// 2. 开始支付流程
	[MaxLeapPay startPayment:payment completion:^(MLPayResult * _Nonnull result) {
	    if (result.code == MLPaySuccess) {
	        NSLog(@"支付成功");
	    } else {
	        NSLog(@"支付失败");
	    }
	}];
	```

### 使用银联支付

MaxPay iOS SDK 通过调用银联官方的手机支付控件来完成银联支付。

#### 银联手机控件支付

1. 添加银联支付跳转应用白名单

	uppaywallet<br>
	uppaysdk
	
2. 发起支付

	```
	// 1. 生成订单
	MLPayment *payment = [[MLPayment alloc] init];
	
	// 设置通过”银联手机控件支付“渠道支付
	payment.channel = MLPayChannelUnipayApp;
	
	// 生成订单号，订单号要保证在商户系统中唯一
	NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
	[formatter setDateFormat:@"yyyyMMddHHmmssSSS"];
	NSString *billNo = [formatter stringFromDate:[NSDate date]];
	payment.billNo = billNo;
	
	// 订单简要说明
	payment.subject = @"测试";
	
	// 总金额，单位：分
	payment.totalFee = 0.01 * 100;
	
	// 银联支付完成后通知支付结果时需要用到，没有固定格式，可以是 info.plist -> URL Types 中的任意一个 scheme
	payment.scheme = @"paysample";
	
	// 银联需要配置 returnUrl
	payment.returnUrl = @"http://maxleap.cn/returnUrl";
	
	// 配置自定义字段
	[payment.extraAttrs addEntriesFromDictionary:@{@"keyA":@"valueA"}];
	
	// 2. 开始支付流程
	[MaxLeapPay startPayment:payment completion:^(MLPayResult * _Nonnull result) {
	    if (result.code == MLPaySuccess) {
	        NSLog(@"支付成功");
	    } else {
	        NSLog(@"支付失败");
	    }
	}];
	```

### 订单查询

1. 如果知道订单流水号(billNo)和订单支付渠道(channel)，可以使用 `fetchOrderInfoWithBillNo:channel:block:` 直接获取订单信息，在回调中，可以检查订单状态。

	```
	NSString *billNo;
	MLPayChannel channel = MLPayChannelAliApp;
	[MaxLeapPay fetchOrderInfoWithBillNo:billNo channel:channel block:^(MLOrder * 	_Nonnull order, NSError * _Nonnull error) {
	    if (order) {
	        if ([order.status isEqualToString:@"pay"]) {
	               // 订单已经成功支付
	        } else {
	           // 订单没有支付
	        }
	    } else {
	        // 查询失败，订单不存在或者网络出错
	    }
	}];
	```

2. 如果只知道订单号，也可以查询，但由于不同支付渠道订单号有可能一样，因此查询结果中可能会有多个订单。

	```
	[MaxLeapPay queryOrderWithBillNo:@"fffsa" block:^(NSArray * _Nullable objects, NSError * _Nullable error) {
	    if (error) {
	        // 出错了
	    } else {
	        if (objects.count == 0) {
	            // 订单不存在
	        } else {
	            // 查询到订单信息
	        }
	    }
	}];
	```
