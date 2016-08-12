# SDK 简介

MaxLeap Android SDK 集中整合在 maxleap-sdk-all.zip 文件中。

## 1 闭源模块

### maxleap-sdk-all.zip

[下载](https://cscdn.maxleap.cn/2.0/download/NTdhM2ZiZGIxNjllN2QwMDAxNjBhZGM0/zcf-220fc1ea-859f-403b-be1d-8fcfb8c114d7.zip)

包含以下代码库：

maxleap-sdk-core-{版本}.jar 核心库，下面的代码库都依赖它

<span id="MaxSupport_detail"></span>
maxleap-sdk-support-{版本}.jar 用户支持模块，支持用户反馈，FAQ 管理等功能。

目录：maxleap-sdk-support-resources 用户支持模块资源文件。

<span id="MaxLeapPay_detail"></span>
maxleap-sdk-pay-{版本}.jar 支付模块，支持支付宝支付、微信支付、银联支付。

<span id="MaxIM_detail"></span>
maxleap-sdk-im-{版本}.jar 实时通讯模块，支持单聊、多聊等功能

<span id="MaxSocial_detail"></span>
maxleap-sdk-social-{版本}.jar 包括社交分享及应用内社交模块，支持发帖、评论／点赞、关注、朋友圈、广场等功能。

<span id="MLQQUtils_detail"></span>
maxleap-sdk-qq-{版本}.jar QQ 登录模块

<span id="MLWeChatUtils_detail"></span>
maxleap-sdk-wechat-{版本}.jar 微信登录模块

<span id="MLWeiboUtils_detail"></span>
maxleap-sdk-weibo-{版本}.jar 微博登录模块


<span id="MaxLeap_detail"></span>

#### maxleap-sdk-core-{版本}.jar


maxleap-sdk-core.jar  内置功能以及使用指南：

- 云数据库, [使用指南][cloud_data]
- 用户系统(不包含第三方登录), 建议先仔细阅读[数据存储][cloud_data]部分 MLObject 的一些基本操作，[使用指南][accout_system]
- 云代码调用, [使用指南][cloud_code]
- 数据分析, [使用指南][analytics]
- 在线参数, [使用指南][cloud_config]
- 短信服务, [使用指南][smscode]
- 推送营销, [使用指南][marketing]


## 2 开源 UI 组件

### 2.1 MaxLoginUI

登录组件，内置 注册界面，登录界面，其他登录界面（包含手机号登录，第三方平台账号登录）。

组件地址：[https://github.com/MaxLeap/Module-MaxLogin-Android](https://github.com/MaxLeap/Module-MaxLogin-Android)

**建议使用之前先了解** [云数据库(MLObject 的一些基本操作)][cloud_data]和[账户系统][accout_system]

### 2.2 MaxIMUI

聊天 UI 组件，内置 联系人和群组列表界面，最近聊天列表，聊天界面。

组件地址：[https://github.com/MaxLeap/Module-MaxIM-Android](https://github.com/MaxLeap/Module-MaxIM-Android)


### 2.3 MaxSocialUI

应用内社交组件，包含 说说发布界面，说说列表界面，广场界面，朋友圈界面等。

组件地址：[https://github.com/MaxLeap/Module-MaxSocial-iOS](https://github.com/MaxLeap/Module-MaxSocial-iOS)


### 2.4 MaxPayUI

移动支付界面组件。

组件地址：https://github.com/MaxLeap/Module-MaxPay-Android

### 2.5 MaxShare

依赖于第三方平台 SDK。支持 新浪微博，微信好友，微信朋友圈，QQ好友，QQ空间 分享，但是都需要集成对应平台的 SDK，更详细内容请查阅[社交分享使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#%E7%A4%BE%E4%BA%A4%E5%88%86%E4%BA%AB)。

组件地址：[https://github.com/MaxLeap/Module-MaxShare-Android](https://github.com/MaxLeap/Module-MaxShare-Android)

### 2.6 MaxIssues

用户反馈组件，通过这个组件，用户可以创建一个会话，用来反馈问题。客服可以与之对话，近似实时聊天。

组件地址：[https://github.com/MaxLeap/Module-MaxIssues-Android](https://github.com/MaxLeap/Module-MaxIssues-Android)

### 2.7 MaxFAQ

常见问题界面组件，包含 问题分类，问题列表，问题答案界面。可以在后台编辑问题，然后在客户端显示出来。

组件地址：[https://github.com/MaxLeap/Module-MaxFAQ-Android](https://github.com/MaxLeap/Module-MaxFAQ-Android)



[cloud_data]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#数据存储
[accout_system]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#账号服务
[cloud_code]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#云代码
[analytics]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#数据分析
[cloud_config]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#在线参数

[marketing]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#推送营销

[smscode]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#账号服务-短信登录

[MaxLeapPay_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#移动支付
[MaxSocial_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#应用内社交
[MLQQUtils_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#账号服务-第三方登录-qq-登录
[MLWeChatUtils_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/android.html#账号服务-第三方登录-微信登录
[MLWeiboUtils_detail]: https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#账号服务-第三方登录-新浪微博登录