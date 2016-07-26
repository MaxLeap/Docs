# 1 总览

MaxLeap SDK 有三个压缩包：maxleap-sdk-ios.zip, maxleap-im-ios.zip, maxleap-sdk-iosext.zip

另外，还发布了一些开源 UI 组件。

## 1.1 maxleap-sdk-ios.zip

包含以下代码库：

[MaxLeap.framework 核心库，下面的代码库都依赖它](#MaxLeap_detail)

[MaxLeapPay.framework 支付模块](#MaxLeapPay_detail)

[MaxSocial.framework 社交模块](#MaxSocial_detail)

[MLQQUtils.framework QQ 登录模块](#MLQQUtils_detail)

[MLWeChatUtils.framework 微信登录模块](#MLWeChatUtils_detail)

[MLWeiboUtils.framework 微博登录模块](#MLWeiboUtils_detail)


<span id="maxleap-im-ios"></span>
## 1.2 maxleap-im-ios.zip

包含以下代码库：

SocketIOClientSwift.framework **动态库，**即时通讯基础功能代码库

MaxIMLibDynamic.framework **动态库，**MaxLeap 提供的即时通讯功能代码库

MaxIMLib.framework **静态库，MaxIMLibDynamic.framework 的静态版本**

> **_MaxIMLibDynamic.framework 与 MaxIMLib.framework 二选一，不可以同时集成_**

集成使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E5%8D%B3%E6%97%B6%E9%80%9A%E8%AE%AF

## 1.3 maxleap-sdk-iosext.zip

这个压缩包只包含一个代码库 MaxLeapExt.framework，这个代码库是 MaxLeap.framework 的精简版本，支持 iOS 扩展程序，[点这里查看详细功能介绍](#MaxLeapExt_detail)。

## 1.4 开源 UI 组件

### 1.4.1 MaxLoginUI

登录组件，内置 注册界面，登录界面，其他登录界面（包含手机号登录，第三方平台账号登录）。

组件地址：https://github.com/MaxLeap/Module-MaxLogin-iOS

> 建议使用之前先了解[账户管理系统](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E6%9C%8D%E5%8A%A1)

### 1.4.2 MaxIMUI

聊天 UI 组件，内置 联系人和群组列表界面，最近聊天列表，聊天界面。

组件地址：https://github.com/MaxLeap/Module-MaxIM-iOS

> 建议使用之前先了解 [MaxIMLib.framework](#maxleap-im-ios)

### 1.4.3 MaxSocialUI

应用内社交组件，包含 说说发布界面，说说列表界面，广场界面，朋友圈界面等。

组件地址：https://github.com/MaxLeap/Module-MaxSocial-iOS

> 建议使用之前先了解 [应用内社交基础模块](#MaxSocial_detail)

### 1.4.4 MaxPayUI

移动支付界面组件。

组件地址：https://github.com/MaxLeap/Module-MaxPay-iOS

> 建议使用之前先了解 [移动支付基础模块](#MaxLeapPay_detail)

### 1.4.5 MaxShare

社交分享组件，此组件可以单独使用，只依赖于第三方平台 SDK。支持 新浪微博，微信好友，微信朋友圈，QQ好友，QQ空间 分享，但是都需要集成对应平台的 SDK，更详细内容请查阅[社交分享使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E7%A4%BE%E4%BA%A4%E5%88%86%E4%BA%AB)。

组件地址：https://github.com/MaxLeap/Module-MaxShare-iOS

使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E7%A4%BE%E4%BA%A4%E5%88%86%E4%BA%AB

### 1.4.6 MaxIssues

用户反馈组件，通过这个组件，用户可以创建一个会话，用来反馈问题。客服可以与之对话，近似实时聊天。

组件地址：https://github.com/MaxLeap/Module-MaxIssues-iOS

### 1.4.7 MaxFAQ

常见问题界面组件，包含 问题分类，问题列表，问题答案界面。可以在后台编辑问题，然后在客户端显示出来。

组件地址：https://github.com/MaxLeap/Module-MaxFAQ-iOS

# 2 详细说明

<span id="MaxLeap_detail"></span>
## 2.1 MaxLeap.framework

集成指南：https://maxleap.cn/s/web/zh_cn/quickstart/ios/core/existing.html

使用文档：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8

> ### 在使用用户管理系统之前，建议先仔细阅读[数据存储](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8)部分。

### 2.1.1 内置功能

云数据库, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8)<br>
用户系统(不包含第三方登录), [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E6%9C%8D%E5%8A%A1)<br>
云代码调用, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E4%BA%91%E4%BB%A3%E7%A0%81)<br>
数据分析, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90)<br>
在线参数, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E5%9C%A8%E7%BA%BF%E5%8F%82%E6%95%B0)<br>
短信服务, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E6%9C%8D%E5%8A%A1-%E7%9F%AD%E4%BF%A1%E9%AA%8C%E8%AF%81%E6%9C%8D%E5%8A%A1)<br>
推送营销, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%8E%A8%E9%80%81%E8%90%A5%E9%94%80)<br>

<span id="MLQQUtils_detail"></span>
## 2.2 MLQQUtils.framework

QQ 登录模块，需要集成 TencentOpenAPI.framework。

集成使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E…%99%BB%E5%BD%95-%E4%BD%BF%E7%94%A8-qq-%E8%B4%A6%E5%8F%B7%E7%99%BB%E9%99%86

<span id="MLWeChatUtils_detail"></span>
## 2.3 MLWeChatUtils.framework

微信登录模块，需要集成 libWeChatSDK

集成使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E…5-%E4%BD%BF%E7%94%A8%E5%BE%AE%E4%BF%A1%E8%B4%A6%E5%8F%B7%E7%99%BB%E9%99%86

<span id="MLWeiboUtils_detail"></span>
## 2.4 MLWeiboUtils.framework

微博登录模块，需要集成 libWeiboSDK

集成使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E…5-%E4%BD%BF%E7%94%A8%E5%BE%AE%E5%8D%9A%E8%B4%A6%E5%8F%B7%E7%99%BB%E9%99%86

<span id="MaxLeapPay_detail"></span>
## 2.5 MaxLeapPay.framework

移动支付基础模块，支持支付宝支付，微信支付，银联支付。

注意：开启第三方支付功能需要集成第三方官方 SDK。

集成使用指南：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E7%A7%BB%E5%8A%A8%E6%94%AF%E4%BB%98

<span id="MaxSocial_detail"></span>
## 2.6 MaxSocial.framework

社交模块，支持发帖，评论／点赞，关注，朋友圈，广场等功能。

集成使用文档：https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E5%BA%94%E7%94%A8%E5%86%85%E7%A4%BE%E4%BA%A4

<span id="MaxLeapExt_detail"></span>
## 2.7 MaxLeapExt.framework

内置功能：

云数据库, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%95%B0%E6%8D%AE%E5%AD%98%E5%82%A8)<br>
用户系统(不包含第三方登录), [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E6%9C%8D%E5%8A%A1)<br>
云代码调用, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E4%BA%91%E4%BB%A3%E7%A0%81)<br>
数据分析, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90)<br>
在线参数, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E5%9C%A8%E7%BA%BF%E5%8F%82%E6%95%B0)<br>
短信服务, [使用指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/ios.html#%E8%B4%A6%E5%8F%B7%E6%9C%8D%E5%8A%A1-%E7%9F%AD%E4%BF%A1%E9%AA%8C%E8%AF%81%E6%9C%8D%E5%8A%A1)<br>
