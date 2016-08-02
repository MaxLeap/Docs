# SDK 简介

MaxLeap SDK 有三个压缩包：maxleap-sdk-ios.zip, maxleap-im-ios.zip, maxleap-sdk-iosext.zip

另外，还发布了一些开源 UI 组件。

## 1 闭源模块

### 1.1 maxleap-sdk-ios.zip

包含以下代码库：

MaxLeap.framework 核心库，下面的代码库都依赖它，[详细功能使用指南](#MaxLeap_detail)

<span id="MaxLeapPay_detail"></span>
MaxLeapPay.framework 支付模块，支持支付宝支付、微信支付、银联支付。[集成使用指南][MaxLeapPay_detail]

<span id="MaxSocial_detail"></span>
MaxSocial.framework 社交模块，支持发帖、评论／点赞、关注、朋友圈、广场等功能，[集成使用指南][MaxSocial_detail]

<span id="MLQQUtils_detail"></span>
MLQQUtils.framework QQ 登录模块，[集成使用指南][MLQQUtils_detail]

<span id="MLWeChatUtils_detail"></span>
MLWeChatUtils.framework 微信登录模块，[集成使用指南][MLWeChatUtils_detail]

<span id="MLWeiboUtils_detail"></span>
MLWeiboUtils.framework 微博登录模块，[集成使用指南][MLWeiboUtils_detail]


<span id="MaxLeap_detail"></span>
#### MaxLeap.framework

集成指南：https://maxleap.cn/s/web/zh_cn/quickstart/ios/core/existing.html

MaxLeap.framework 内置功能以及使用指南：

- 云数据库, [使用指南][cloud_data]
- 用户系统(不包含第三方登录), 建议先仔细阅读[数据存储][cloud_data]部分 MLObject 的一些基本操作，[使用指南][accout_system]
- 云代码调用, [使用指南][cloud_code]
- 数据分析, [使用指南][analytics]
- 在线参数, [使用指南][cloud_config]
- 短信服务, [使用指南][smscode]
- 推送营销, [使用指南][marketing]


<span id="maxleap-im-ios"></span>
### 1.2 maxleap-im-ios.zip

包含以下代码库：

SocketIOClientSwift.framework **动态库，**即时通讯基础功能代码库

MaxIMLibDynamic.framework **动态库，**MaxLeap 提供的即时通讯功能代码库

MaxIMLib.framework **静态库，MaxIMLibDynamic.framework 的静态版本**

**_MaxIMLibDynamic.framework 与 MaxIMLib.framework 二选一，不可以同时集成_**

集成使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF

### 1.3 maxleap-sdk-iosext.zip

这个压缩包只包含一个代码库 MaxLeapExt.framework，这个代码库是 MaxLeap.framework 的精简版本，支持 iOS 扩展程序。

这个代码库集成了以下功能：

- 云数据库, [使用指南][cloud_data]
- 用户系统(不包含第三方登录), 建议先仔细阅读[数据存储][cloud_data]部分 MLObject 的一些基本操作，[使用指南][accout_system]
- 云代码调用, [使用指南][cloud_code]
- 数据分析, [使用指南][analytics]
- 在线参数, [使用指南][cloud_config]
- 短信服务, [使用指南][smscode]

## 2 开源 UI 组件

### 2.1 MaxLoginUI

登录组件，内置 注册界面，登录界面，其他登录界面（包含手机号登录，第三方平台账号登录）。

组件地址：https://github.com/MaxLeap/Module-MaxLogin-iOS

**建议使用之前先了解[云数据库(MLObject 的一些基本操作)][cloud_data]和[账户管理系统][accout_system]**

### 2.2 MaxIMUI

聊天 UI 组件，内置 联系人和群组列表界面，最近聊天列表，聊天界面。

组件地址：https://github.com/MaxLeap/Module-MaxIM-iOS

**建议使用之前先了解 [MaxIMLib.framework](#maxleap-im-ios)**

### 2.3 MaxSocialUI

应用内社交组件，包含 说说发布界面，说说列表界面，广场界面，朋友圈界面等。

组件地址：https://github.com/MaxLeap/Module-MaxSocial-iOS

**建议使用之前先了解 [应用内社交基础模块(MaxSocial.framework)](#MaxSocial_detail)**

### 2.4 MaxPayUI

移动支付界面组件。

组件地址：https://github.com/MaxLeap/Module-MaxPay-iOS

**建议使用之前先了解 [移动支付基础模块(MaxLeapPay.framework)](#MaxLeapPay_detail)**

### 2.5 MaxShare

社交分享组件，此组件可以单独使用，只依赖于第三方平台 SDK。支持 新浪微博，微信好友，微信朋友圈，QQ好友，QQ空间 分享，但是都需要集成对应平台的 SDK，更详细内容请查阅[社交分享使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E7%A4%BE%E4%BA%A4%E5%88%86%E4%BA%AB)。

组件地址：https://github.com/MaxLeap/Module-MaxShare-iOS

使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E7%A4%BE%E4%BA%A4%E5%88%86%E4%BA%AB

### 2.6 MaxIssues

用户反馈组件，通过这个组件，用户可以创建一个会话，用来反馈问题。客服可以与之对话，近似实时聊天。

组件地址：https://github.com/MaxLeap/Module-MaxIssues-iOS

### 2.7 MaxFAQ

常见问题界面组件，包含 问题分类，问题列表，问题答案界面。可以在后台编辑问题，然后在客户端显示出来。

组件地址：https://github.com/MaxLeap/Module-MaxFAQ-iOS



[cloud_data]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#数据存储
[accout_system]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#账号服务
[cloud_code]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#云代码
[analytics]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#数据分析
[cloud_config]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#在线参数
[smscode]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#账号服务-短信验证服务
[marketing]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#推送营销

[MaxLeapPay_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#移动支付
[MaxSocial_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#应用内社交
[MLQQUtils_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#账号服务-第三方登录-使用-qq-账号登陆
[MLWeChatUtils_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#账号服务-第三方登录-使用微信账号登陆
[MLWeiboUtils_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#账号服务-第三方登录-使用微博账号登陆