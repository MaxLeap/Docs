# Analytics

## Introduction

###	What is Leap Cloud Analytics

Leap Cloud Analytics collects all kinds of data of apps and users with clients and Cloud Data. With professional analytics in Leap Cloud, there would be a final operator-oriented report. 

###	Why is Leap Cloud Analytics Necessary

Leap Cloud Analytics is a real-time free and professional mobile apps Analytics Service. It provides multi-analysis of operation status, deep knowledge of typical users and advice on optimizing operating strategies, which will finally realize：

*	Comprehend the operation status and trend: from New Users, Active Users, Sessions and App Versions to User bahevior, User properties and behavioral features, we provide all kinds of properties to help you understand your app's operation and iteration effect. 
*	Fully perceive user bahevior: Reproduce the behavior of each user and keep abreast of their engagement, retention and conversion.
*	Improve user experience: Define user segments and customize user experience for differenct segments.
*	Promote app revenue: Track consumer behavior, make marketing strategies and maximize the marketing effect.


###	How Does Leap Cloud Analytics Work

Leap Cloud Analytics SDK helps us track user behavoir and provides data for cloud Analytics service, which includes:

*  Collect information automatically (like terminal info, installation info, etc.)
*  Track sessions and page view
*  Track customized events
*  Track comsuption

The data collected will be saved to cloud. Leap Cloud will analyze users in each time zone as well as the overview of all users. Moreover, you can customize filters and generate relative reports.


## Enable Service
After the installation of SDK, Leap Cloud will track app data automatically, including:
1.	Terminal
2.	Start and exit
3.	App crash and other exception message

Leap Cloud Analytics Service is **Enabled** by default. You can add following code in `onCreate()` in main `Activity` to **disable** it: 

```Java
LCAnalytics.setAnalyticsEnabled(false);
```

## Channel
Channel represents the store users download the app from, like GooglePlay, App Store or other customized sources. You can add following code in AndroidManifest.xml 

```java
<application>
	<meta-data
		android:name="LC_channel"
		android:value="YOUR_CHANNEL_NAME">
	</meta-data>
</application>
```

##	Session
Session is the period of time a user interfaces with an application. Session can take records of New Users, Active Users, Start account, Session Length and etc.
####Track Session
* Session will be generated automatically on user's login.
* When users switch among Activities after the login, we need to add following code in `onPause()` and `onResume()` of all Acitivities to realize Pause, Resume and decide whether users have started a new session. (Tips?)

	```java
	@Override
	protected void onPause() {
	  super.onPause();
	  LCAnalytics.onPause(this);
	}
	@Override
	protected void onResume() {
	  super.onResume();
	  LCAnalytics.onResume(this);
	}
	```

* If users go back to the app within a certain time after they left the app, it will be considered as resuming session. The time range can be defined (specified in seconds) by adding following code in `onCreate()` in Main Activity: 
	```java
	LCAnalytics.setSessionContinueSecond(30)
	```
* If a user leaves your application and returns after a certain time, then it counts as a new start and the old session is over. 

## Page Customization 

Page is the interface visited by users. Page can take records of Visit Times, Total Occurrences, Screen Flow, etc.


###Property Description

Property Name|Type|Description
---|---|---|---
pageName|String|User-defined name of the page


###Track Customized Page
Add following code at the beginning of the page:

```java
@Override
protected void onResume() {
  super.onResume();
  LCAnalytics.onPageStart(pageName);
}
```

Add following code at the end of the page:

```java
@Override
protected void onPause() {
  super. onPause();
  LCAnalytics.onPageEnd(pageName);
}
```

Notice:

* Both `onPageStart()` and `onPageEnd()` should be assigned on each page and there should be no intersections.
* If the page is realized with Activity + Fragment, we should add aforementioned code in `onResume()` and `onPause()` of Fragment to record pageview towards the Fragment. 

## Event Customization

Event Customization can set tracking point in app and take records of users action and collect data.


###Property Description
Property Name|Type|Description
---|---|---|---
eventId|String|Event ID
key| String |Parameter
value| String|Parameter Value

###Track Customized Events
Invoke such method in code you want to track: 

```java
LCAnalytics.logEvent(eventId, eventCount, dimensions);
```
