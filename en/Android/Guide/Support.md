LeapCloud
#Support
##Introduction
Support is a comprehensive customer service project provided by LeapCloud for developers.This project provides complete FAQ page and feedback chat window in clients. Support service also provides FAQ list management and feedback handling interface in Console.


## Preparation

1. Install and config LeapCloud Core SDK. Please check [QuickStart - Core SDK](..) for more details.
2. Install and config HelpCenter SDK. Please check [QuickStart - HelpCenter](..) for more details.

## Enter Help Center
You can invoke following code to invoke FAQ in Help Center:

```java
LCHelpCenter.openFaqs(this);
```

Therefore, users can check FAQ list in Help Center or provide feedbacks.

## Enter Feedback

You can allow user's access to Feedback page from the top right button on Help Center with following configuration:

Add following code after `LCConfig.initialize()` in `Application.onCreate()`:

```java
LCHelpCenter.allowAlertNewMessage(true);
```

Or, you can enter Feedback page directly with `LCHelpCenter.openConversation()`:

```java
LCHelpCenter.openConversation(context);
```



