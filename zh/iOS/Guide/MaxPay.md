# MaxPay

## 简介

目前支持支付宝App支付功能，以及根据订单号查询订单功能。我们将持续更新，支持更多支付平台和更多功能，敬请期待。

## 使用

请确保你使用的是 Xcode 6.4 以及更新版本。

### 使用 `cocoapods` 安装

在 Podfile 中加上下面这行:

```
pod 'MaxLeapPay'
```

打开应用 `终端`, 执行以下命令

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

4. 使用支付宝还需以下步骤

	1. [下载并解压最新支付宝 SDK](https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.5TxcD7&treeId=59&articleId=103563&docType=1)
	2. 找到 `AliPay` 文件夹，该文件夹包含 `AliPaySDK.framework` 和 `AliPaySDK.bundle`，把该文件夹拖进项目中。

到这里 `MaxLeapPay.framework` 已经安装完成，但是所有的支付渠道应该都为不可用状态，因为还没有集成这些渠道对应的支付 SDK。

你可以设置支付环境，以用来测试。`MaxLeapPay` 提供了三种环境，Production(产品环境)、Sandbox(沙盒环境)、Offline(离线环境)。

沙盒环境和离线环境都可以用来测试，区别在于：沙盒环境会连接沙盒测试服务器，而离线环境不会连接服务器，只会使用一些模拟数据。

**注意：**不是所有渠道都支持沙盒环境和离线环境，如果某个渠道不支持当前环境，`+[MaxLeapPay isChannelAvaliable:]` 会返回 `NO`.

## 使用支付宝支付

```
// 1. 生成订单
MLPayment *payment = [[MLPayment alloc] init];

// 设置使用 AliApp 渠道支付，该渠道会打开支付宝应用进行支付
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

// 支付宝支付完成后通知支付结果时需要用到，没有固定格式
payment.scheme = @"maxleappaysample";


// 2. 开始支付流程
[MaxLeapPay startPayment:payment completion:^(MLPayResult * _Nonnull result) {
    if (result.code == MLPaySuccess) {
        NSLog(@"支付成功");
    } else {
        NSLog(@"支付失败");
    }
}];
```

处理支付宝应用回调:

```
// iOS 2.0 -- iOS 8.4
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return [MaxLeapPay handleOpenUrl:url completion:^(MLPayResult * _Nonnull result) {
        // 跳钱包支付结果回调，保证跳转钱包支付过程中，即使调用方app被系统kill时，能通过这个回调取到支付结果。
    }];
}

// iOS 4.2 -- iOS 8.4
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [MaxLeapPay handleOpenUrl:url completion:^(MLPayResult * _Nonnull result) {
        // 跳钱包支付结果回调，保证跳转钱包支付过程中，即使调用方app被系统kill时，能通过这个回调取到支付结果。
    }];
}

// iOS 9.0 or later
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
    return [MaxLeapPay handleOpenUrl:url completion:^(MLPayResult * _Nonnull result) {
        // 跳钱包支付结果回调，保证跳转钱包支付过程中，即使调用方app被系统kill时，能通过这个回调取到支付结果。
    }];
}
```
