---
title: iOS Developer Guide

language_tabs:
  - objective_c
  - Swift

---

# App FAQs

## Install SDK

1. Install LAS SDK

If you haven't installed LAS SDK yet, please check [QuickStart][ios_quick_start_guide] to get LAS SDK up and running.
It should be noted that we only support iOS 6.0 and later. You can check our [API Reference][api_reference] to learn more detailed information about LAS SDK.

2. Install HelpCenter

Deconpress the file you just downloaded and you can get the HelpCenter.embededframework


## Show FAQ Page

Import `LASHelpCenter.h`

```
#import <LASHelpCenter/LASHelpCenter.h>
```

Invoke following code to show FAQ page

	
```
[[LASHelpCenter sharedInstance] showFAQs:self]; // self is the ViewController of popping App Issues page
```

[ios_quick_start_guide]: ../../quickstart/ios/existing.html