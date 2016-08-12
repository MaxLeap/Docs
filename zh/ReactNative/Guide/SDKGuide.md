# SDK 简介

MaxLeap RN SDK 包括一系列的基础包和一些开源 UI 组件。

## 1 详细介绍

### 1.1 maxleap-react-native [![npm version](https://badge.fury.io/js/maxleap-react-native.svg)](http://badge.fury.io/js/maxleap-react-native)

核心包，MaxLeap 的很多其它 SDK 都依赖于它。

[集成指南](quickstart/reactnativequickstart.html)

MaxLeap.framework 内置功能以及使用指南：

- 云数据库, [使用指南][cloud_data]
- 用户系统(不包含第三方登录), 建议先仔细阅读[数据存储][cloud_data]部分 MLObject 的一些基本操作，[使用指南][accout_system]
- 云代码调用, [使用指南][cloud_code]
- 数据分析, [使用指南][analytics]
- 在线参数, [使用指南][cloud_config]
- 推送营销, [使用指南][marketing]


### 1.2 maxpay-react-native [![npm version](https://badge.fury.io/js/maxpay-react-native.svg)](http://badge.fury.io/js/maxpay-react-native)

从 Native SDK 导出的支付接口，[集成指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#移动支付)

### 1.3 maxleap-social-react-native [![npm version](https://badge.fury.io/js/maxleap-social-react-native.svg)](http://badge.fury.io/js/maxleap-social-react-native)

从 Native SDK 导出的应用内社交接口，[集成指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#应用内社交)

### 1.4 maxlogin-react-native [![npm version](https://badge.fury.io/js/maxlogin-react-native.svg)](http://badge.fury.io/js/maxlogin-react-native)

简单易用的 登录／注册／手机号登录 界面。开源组件地址：[https://github.com/MaxLeap/Module-MaxLogin-RN](https://github.com/MaxLeap/Module-MaxLogin-RN)

### 1.5 maxshare-react-native [![npm version](https://badge.fury.io/js/maxshare-react-native.svg)](http://badge.fury.io/js/maxshare-react-native)

分享内容到第三方社交平台，目前支持分享到QQ好友，QQ空间，微信好友，微信朋友圈，新浪微博。

[集成指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#社交分享)

### 1.6 maxleap-helpcenter-react-native [![npm version](https://badge.fury.io/js/maxleap-helpcenter-react-native.svg)](http://badge.fury.io/js/maxleap-helpcenter-react-native)

由 Native SDK 导出的接口，包含 FAQ 和 Issues 两个模块。

[集成指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#用户支持)

### 1.7 maxleap-im [![npm version](https://badge.fury.io/js/maxleap-im.svg)](http://badge.fury.io/js/maxleap-im)

即时通信的 SDK，网页环境和 ReactNative 环境通用。

[集成指南](https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#即时通讯)

[cloud_data]: https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#数据存储
[accout_system]: https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#账号服务
[cloud_code]: https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#云代码
[analytics]: https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#数据分析
[cloud_config]: https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#在线参数
[marketing]: https://maxleap.cn/s/web/zh_cn/guide/devguide/reactnative.html#推送营销

