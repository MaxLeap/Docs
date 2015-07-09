---
title: iOS Developer Guide

language_tabs:
  - objective_c
  - Swift

---

# Statistics

If you haven't installed LAS SDK yet, please check [QuickStart][ios_quick_start_guide] to get LAS SDK up and running.
It should be noted that we only support iOS 6.0 and later. You can check our [API Reference][api_reference] to learn more detailed information about LAS SDk.

## Send Statistics

### Collect Data Automatically

After SDK's integration according to [QuickStart][ios_quick_start_guide], you can start using some basic functions of Statistics .
LAS SDK wil collect the data of New User Amount, frequency and duration of sessions. You can check the results in Dashboard-> App-> Analytics.

### UIViewController

This function can check the Duration of each View. Please make sure that each View is matched and without any nested relations:

```objective_c
- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [LASAnalytics beginLogPageView:@"PageOne"];
}
 
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [LASAnalytics endLogPageView:@"PageOne"];
}
```
 
### Customized Events

LAS only supports Count Event right now.

Customized Events can help you analyze user behaviour and check the real-time data in Console.
It should be noted that the name of cuntomized events (event_id) should be set as quiescent value. Otherwise, the event list might turn out to be too large to be analyzed about user behaviour and purpose. 
 
#### Frequency of Certain Event

```
[LASAnalytics trackEvent:@"event_id"];
```

#### Count Attributes of Certain Event

For example,
For counting the purchase amount, product type and product amount in E-Commence app, you can invoke such code in the purchase function:

```objective_c
NSDictionary *dict = @{@"type" : @"book", @"quantity" : @"3"};
[LASAnalytics trackEvent:@"purchase" dimensions:dict];
```

[ios_quick_start_guide]: ../../quickstart/ios/existing.html