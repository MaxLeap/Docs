---
title: iOS Developer Guide

language_tabs:
  - objective_c
  - Swift

---

# App Issues

## Install SDK

1. Install LAS
  If you haven't installed LAS SDK, please check [QuickStart][ios_quick_start_guide] to get LAS SDK up and running.
  It should be noted that we only support iOS 6.0 and later. You can check our [API Reference][api_reference] to learn more detailed information about LAS SDK.

2. Install HelpCenter
  Deconpress the file you just downloaded and you can get the HelpCenter.embededframework

## Show FAQ Page

Import `LASHelpCenter.h`

```
#import <LASHelpCenter/LASHelpCenter.h>
```

In order to refresh new support responses and notify users on starting the app, please add following code behind `setApplication:clientKey` :

```
[LASHelpCenter install];
```

You can choose whether to pop UIAlert on receiving new messages:

```
[LASHelpCenter alertNewMessage:YES];
```

There is a Contact Us button on the top right FAQ page, you can enter the App Issues page through that.
Or, you can enter App Issues page with following code:

	
```
[[LASHelpCenter sharedInstance] showConversation:self]; // self is the ViewController of App Issues page
```


[ios_quick_start_guide]: ../../quickstart/ios/existing.html
