
#支持
##简介
Support服务是LeapCloud为开发者提供的一套标准应用客服方案。在客户端，此方案提供完整的FAQ的显示页面及问题反馈对话页面。在Console端，Support服务提供FAQ的管理及用户反馈的处理界面。

## 准备工作

1. 安装并配置LeapCloud Core SDK. 详细步骤，请查看[QuickStart - Core SDK](..)
2. 安装并配置HelpCenter SDK. 详细步骤，请查看[QuickStart - HelpCenter](..)

## 进入Help Center页面
Help Center页面调用FAQ页面非常方便，您只需调用如下代码即可：

```java
LCHelpCenter.openFaqs(this);
```

用户便可在Help Center页面内查看FAQ列表，或者提供反馈。

## 进入反馈问题页面

您可以通过以下配置，允许用户可以通过Help Center页面右上角的按钮进入反馈问题对话页面：

在`Application.onCreate()`中，`LCConfig.initialize()`之后，添加：

```java
LCHelpCenter.allowAlertNewMessage(true);
```

或者，您可以通过下`LCHelpCenter.openConversation()`直接进入反馈问题对话页面：

```java
LCHelpCenter.openConversation(context);
```



