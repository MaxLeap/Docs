
# 用户支持

## 简介

Support 服务是 MaxLeap 为开发者提供的一套标准应用客服方案。在客户端，此方案提供完整的 FAQ 的显示页面及问题反馈对话页面。在 Console 端，Support 服务提供 FAQ 的管理及用户反馈的处理界面。

## 准备工作

1. 安装并配置 MaxLeap Core SDK。详细步骤请查看 [QuickStart - Core SDK](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID)

2. 安装并配置 HelpCenter SDK。详细步骤请查看 [QuickStart - HelpCenter](ML_DOCS_LINK_PLACEHOLDER_SDK_QUICKSTART_ANDROID)

## 进入Help Center页面

Help Center 页面调用 FAQ 页面非常方便，您只需调用如下代码即可：

```java
MLHelpCenter.openFaqs(this);
```

用户便可在 Help Center 页面内查看 FAQ 列表，或者提供反馈。

## 进入反馈问题页面

您可以通过以下配置，允许用户可以通过FHelp Center 页面右上角的按钮进入反馈问题对话页面：

在 `Application.onCreate()` 中，`MaxLeap.initialize()` 之后，添加：

```java
MLHelpCenter.allowAlertNewMessage(true);
```

或者，您可以通过下 `MLHelpCenter.openConversation()` 直接进入反馈问题对话页面：

```java
MLHelpCenter.openConversation(context);
```



