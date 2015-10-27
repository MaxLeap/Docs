# Analytics

## Introduction

###	What is MaxLeap Analytics

MaxLeap Analytics collects all kinds of data of apps and users with clients and  Cloud Data. With professional analytics in MaxLeap, there would be a final operator-oriented report.

###	Why is MaxLeap Analytics Necessary

MaxLeap Analytics is a real-time free and professional mobile apps Analytics Service. It provides multi-analysis of operation status, deep knowledge of typical users and advice on optimizing operating strategies, which will finally realize：

*	**Comprehend the operation status and trend**: from New Users, Active Users, Sessions and App Versions to User bahevior, User properties and behavioral features, we provide all kinds of properties to help you understand your app's operation and iteration effect. 
*	**Fully perceive user bahevior**: Reproduce the behavior of each user and keep abreast of their engagement, retention and conversion.
*	**Improve user experience**: Define user segments and customize user experience for differenct segments.
*	**Promote app revenue**: Track consumer behavior, make marketing strategies and maximize the marketing effect.


###	How Does MaxLeap Analytics Work

MaxLeap Analytics SDK helps us track user behavoir and provides data for cloud Analytics service, which includes:

*  Collect information automatically (like terminal info, installation info, etc.)
*  Track sessions and page view
*  Track customized events
*  Track comsuption

The data collected will be saved to cloud. MaxLeap will analyze users in each time zone as well as the overview of all users. Moreover, you can customize filters and generate relative reports.


## Enable Service
After the installation of SDK, MaxLeap will track app data automatically, including:
1.	Terminal
2.	Start and exit
3.	App crash and other exception message

MaxLeap Analytics Service is **Enabled** by default. 

## Track Access Path

It can do a census about the View length. Please make sure that there is no nest relation among the Views.

```objective_c
- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [MLAnalytics beginLogPageView:@"PageOne"];
}
 
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [MLAnalytics endLogPageView:@"PageOne"];
}
```
 
## Event Customization

Event Customization can set tracking point in app and take records of users action and collect data.

###Property Description
Property Name|Type|Description
---|---|---|---
eventId|String|Event ID
key| String |Parameter
value| String|Parameter Value

Notice that the event_id should be static in case of the huge amount of event lists and the failure of user analysis.
 
### Track Number of Occurrence

```
[MLAnalytics trackEvent:@"event_id"];
```

### Track Number of Certain Property
Instance: You can invoke following method in purchase function to track the purchase amount, type and count of product in an e-commerce app:

```objective_c
NSDictionary *dict = @{@"type" : @"book", @"quantity" : @"3"};
[MLAnalytics trackEvent:@"purchase" dimensions:dict];
```
