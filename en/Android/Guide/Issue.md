
## App Issues

### Install SDK

1. Install LAS Core lib
If there's no LAS Core lib integrated, please check [QuickStart](../../quickstart/android/existing.html) to integrate it first.

2. Install HelpCenter

3. Install HelpCenter Resource

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

