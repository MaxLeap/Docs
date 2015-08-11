# Analytics

## Introduction

###	What is Leap Cloud Analytics

Leap Cloud Analytics collects all kinds of data of apps and users with clients and Cloud Data. With professional analytics in Leap Cloud, there would be a final operator-oriented report. 

###	Why is Leap Cloud Analytics Necessary

Leap Cloud Analytics is a real-time free and professional mobile apps Analytics Service. It provides multi-analysis of operation status, deep knowledge of typical users and advice on optimizing operating strategies, which will finally realize：

*	Comprehend the operation status and trend: from New Users, Active Users, Sessions and App Versions to User bahevior, User attributes and behavioral features, we provide all kinds of indexes to help you understand your app's operation and iteration effect. 
*	Fully perceive user bahevior: Reproduce the behavior of each user and keep abreast of their engagement, retention and conversion.
*	Improve user experience: Define user segments and customize user experience for differenct segments.
*	Promote app revenue: Track consumer behavior, make marketing strategies and maximize the marketing effect.


###	How does Leap Cloud Analytics Work

Leap Cloud Analytics SDK helps us track user behavoir and provides data for cloud analytics service, which includes:

*  Collect information automatically(like terminal info, installation info, etc.)
*  Track sessions and page view
*  Track customized events
*  Track comsuption

The data collected will be saved to cloud. Leap Cloud will analyze users in each time zone as well as the overview of all users. Moreover, you can customize filters and generate relative reports收集到的数据会被保存至云端，Leap Cloud将针对不同时间的数据，对每个用户进行分析，也会将所有用户的数据汇总，进行全局分析。此外，您还可以自定义筛选条件，借助Leap Cloud生成相应的分析报表。

## Enable Service启用服务
After the installation of SDK, Leap Cloud will track app data automatically, including:安装SDK完成后，Leap Cloud服务将自动帮助您追踪应用内的一些数据。自动收集的数据包括：

1.	Terminal终端信息
2.	Startup and exit 应用启动和退出
3.	App crash应用崩溃等异常信息

The defalut status of Leap Cloud Analytics Service is Enabled. You can add following code in `onCreate()` of the main `Activity` to disable it: Leap Cloud分析服务的默认状态为**开启**，如果您希望**关闭**分析服务，您可以在主`Activity`的`onCreate()`中添加如下代码。

```Java
LCAnalytics.setAnalyticsEnabled(false);
```

## Channel渠道
Channel represents where did user download the app, like GooglePlay, App Store or other customized sources. You can add following code in AndroidManifest.xml 渠道代表该应用的来源，如GooglePlay，App Store或其他自定义渠道。只需在AndroidManifest.xml中，添加：

```java
<application>
	<meta-data
		android:name="LC_channel"
		android:value="YOUR_CHANNEL_NAME">
	</meta-data>
</application>
```

##	Session会话
Session is the period of time a user interfaces with an application. Session can take records of New Users, Active Users, Startup account, Session Length and etc.会话（session）代表在某一段时间内，用户与应用之间的交互。纪录会话，可获取新增用户、活跃用户、启动次数、使用时长等基本数据。
####Track Session追踪会话
* Session will be generated automatically on user's login.当用户登录时，会话（session）将自动生成。
* When users switch among Activities after the login, we need to add following code in `onPause()` and `onResume()` of all Acitivities to realize Pause ,Resume and decide whether users have started a new session. 登录后，用户在不同Activity中切换时，我们需要在所有Activity中的`onPause()`和`onResume()`中添加如下代码，以实现会话的暂停和继续，并判断用户是否开始新的会话。(Tips?)

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

* If users go back to the app within a certain time after they left the app, it will be considered as resuming session. The time range can be defined (specified in seconds) by adding following code in `onCreate()` of Main Activity: 离开应用后，在特定时间内，用户重返应用，系统将继续上一个会话。该时间长度可自定义（单位：秒）：在主Activity的`onCreate()`函数中添加：

	```java
	LCAnalytics.setSessionContinueSecond(30)
	```
* If a user leaves your application and returns after a certain time, then it counts as a new start and the old session is over. 当用户注销或离开应用超过特定时间，会话结束。用户重返应用时，将开始新的会话。

## Customized Page自定义页面

Page is the interface visited by users. Page can take records of Visit Times, Total Occurrences, Screen Flow, etc.页面（screen）代表被用户访问的应用界面。纪录页面访问，可获取页面访问量，访问路径，访问深度等数据。

###Filed Description字段说明

Filed Name|Type|Description
---|---|---|---
pageName|String|User-defined name of the page


###Track Customized Page追踪自定义页面
Add following code at the beginning of the page:在页面开始处，添加：

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

Notice:注意：

* Both `onPageStart()` and `onPageEnd()` should be assigned on each page and there should be no intersections.每个页面都必须同时指定`onPageStart()`和`onPageEnd()`. 并且，不同页面之间须相互独立，无交叉。
* If the page is realize with Activity + Fragment, we should add aforementioned code in`onResume()` and `onPause()` of Fragment to record pageview towards the Fragment. 若页面通过Activity + Fragment实现，我们需要在Fragment中的`onResume()`和`onPause()`中添加上述代码，以纪录对该Fragment界面的访问。

## Customized Events自定义事件

Customized Events can set tracking point in app and take records of users action and collect data.自定义事件可以实现在应用程序中埋点，以纪录用户的点击行为并且采集相应数据。

###Filed Description字段说明
Filed Name|Type|Description
---|---|---|---
eventId|String|Event ID
key| String |Parameter
value| String|Parameter Value

###Track Customized Events追踪自定义事件
Invoke such method in code you want to track: 在您希望跟踪的代码部分，调用如下方法：

```java
LCAnalytics.logEvent(eventId, eventCount, dimensions);
```
