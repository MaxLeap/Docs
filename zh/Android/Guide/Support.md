
#Support
##简介
Support服务是Leap Cloud提供的应用客服服务

## 准备工作

1. 安装并配置LAS Core SDK. 详细步骤，请查看[QuickStart - Core SDK](..)
2. 安装并配置HelpCenter SDK. 详细步骤，请查看[QuickStart - HelpCenter](..)

## App FAQs



### 调用FAQ页面
调用FAQ页面非常方便，您只需调用如下代码即可：

```java
LASHelpCenter.openFaqs(this);
```

##App Issue

### Show FAQ Page

```java
LASHelpCenter.openFaqs(this);
```

You make such settings to show the dialog box on receiving new messages.

```java
LASHelpCenter.allowAlertNewMessage(true);
```

There is a Contact Us button on the top right FAQ page, you can enter the App Issues page through that.
Or, you can enter App Issues page directly with following code:

```java
LASHelpCenter.openConversation(context);
```



