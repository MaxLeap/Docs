# 应用内社交

## 简介
应用内社交，在应用开发中出现的场景非常多，包括用户间关注（好友）、朋友圈（时间线）、状态广场、互动（评论、点赞）等常用功能，应用内社交可以认为是一个应用基础通用功能。


## 账号系统

MaxLeap 提供的即时通讯组件支持 **用户已有账号系统** 和 **使用 MaxLeap 账号系统** 两种模式。

### 用户已有账号系统
任何终端用户要加入实时聊天，只需要提供一个唯一标识自己的 clientId 即可，这样可以尽量避免已有账户系统的应用数据暴露，也可以促使 MaxLeap 即时通讯组件专注做好底层的角色。

主要适用于 **已有应用场景**

### MaxLeap 账号系统
开发者也可以使用 MaxLeap 内置的账号系统来接入您的App，使用 MaxLeap 内置账号系统优势在于：

* 支持多种登录方式
  1. 用户名和密码登录模式
  2. 短信验证码登录模式
  3. 第三方社交平台认证信息登录模式
* 所有接入用户由 MaxLeap 账号系统认证后，才可以登录，安全性较高
* 用户无需自行维护账号系统，减少开发时间及运维成本

主要适用于 **新应用场景**

## 基础概念
### 用户
社交圈的用户，IM的用户，maxleap的用户等，由用户标识、多个安装ID构成。
### 关系
用户之间的关系，可以关注一个用户来查看ta的朋友圈内容以及评论点赞。有关注，反向关注，拉黑等功能。
### 状态
朋友圈发布的状态，有文字，图片，连接3种内容。不支持3种内容同时发布
### 评论
朋友圈状态的评论，分为文字评论和点赞2种。
## 功能特性
### 用户关系
用户关系有已关注，未关注，相互关注3种
### 用户状态
状态分为朋友圈状态和广场状态，朋友圈状态无法在广场看到。即发状态时，可以选择发布状态的属性是朋友圈还是广场。
### 评论互动
对已关注的用户发的状态可以评论和点赞。
### 隐私设置
可以拉黑关注自己的用户，让对方看不到自己的状态和评论
## 注意事项
应用内社交不存储用户详细信息, 开发者维护自己的用户系统, 只需适配用户标识ID进行对接。您可以直接使用 MaxLeap 的账户系统，这样可以减少开发成本。
## FAQ
内容更新中

## SDK 集成

### 基础 API 库 MaxSocialLib
MaxSocialLib 是不含界面的基础能力库，封装发表状态，评论，点赞，加好友等 API，引用到 App 工程中后，需要开发者自己实现 UI 界面，相对较轻量，适用于对 UI 有较高订制需求的开发者。

[iOS 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_IOS#INAPPSOCIAL_ZH)

[Android 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_ANDROID#INAPPSOCIAL_ZH)

<!--
[Javascript 开发指南](ML_DOCS_GUIDE_LINK_PLACEHOLDER_JS#INAPPSOCIAL_ZH)
-->
### 界面组件 MaxSocialKit
MaxSocialKit 是将发表状态、评论、点赞、状态列表、评论列表等功能封装为 UI 组件，通过简短的代码，您就可以直接将以上界面集成到您的 App 产品中，省去大量的开发调试时间，并且您可以修改标准 UI 组件代码。您也可以针对自己界面需求自由设计开发。

#### iOS
[Module-MaxSocial-iOS](https://github.com/MaxLeap/Module-MaxSocial-iOS)

#### Android
[Module-MaxSocial-Android](https://github.com/MaxLeap/Module-MaxSocial-Android)


## 样例应用
### iOS
[Sample-MaxChat-iOS](https://github.com/MaxLeap/Sample-MaxChat-iOS)

<!--
### Android
[Sample-MaxChat-Android](https://github.com/MaxLeap/Sample-MaxChat-Android)
-->