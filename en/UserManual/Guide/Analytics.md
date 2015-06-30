## App Analytics
#### INTRODUCTION
In Analytics, you can see all kinds of data of your app, like the amount of New/Active Users, Session Amount, Version info, Retention Rate, Channel, and etc. Of course, you can also analyze users behavior deeply through Custom Events. We cordially recommend you to do that and will introduce the methods and advantages of Custom Events in the following content.
<br />
We will display the data mainly with Histograms and Tables in Analytics. Histograms can compare the size while Tables can show you the exact figure.
<br />
After the [SDK integration](../../quickstart/ios/existing.html) and your first user’s arrival, LAS will begin to collect all kinds of data and show you in arranged form to help you identify problems and make decisions.
<br />
Enter App Analytics and choose your app, then you can check the data.
<br />
#### DASHBOARD
The Dashboard of Analytics is a bulletin of your app data, which includes:

* Daily Report
* Hourly Trend
* Daily Trend
* Top 10 Version Trends
* Top 10 Channels

<p class="image-wrapper">
	![dashboard](/images/dashboard.png)

**Daily report** shows the main data of today, yesterday and the variance. The data includes New Users, Active Users, New/Active Users, Sessions and Average Session Length. You can even check the percentage change of New users and Active users compared with last day.
<br />
**Hourly Trend** includes three sets of data: New Users, Active Users and Sessions. You can check the data of today and yesterday by hour in Line Chart. With Hourly Trend, you can figure out which period owns the most downloading rate and most active users.
<br />
**Daily Trend** is similar to Hourly Trend while the Daily Trend is measured by day. The data contains New Users, Active Users, Total Users and Sessions. The data in past 7 days or 30 days are all available for you to check.
<br />
**Top 10 Version Trends** shows the information of all versions, including New Users, Active Users, Sessions and Session Length. You can check different Session Length of each version and which version owns most active users.
<br />
**Top 10 Channels** provides the information of users from different channels, including New Users, Active Users, Sessions and Session Length. You can figure out which Channel brings the most users and longest Session Length, etc.
<br />

#### Trends

Trends includes:

* New Users for checking the amount variance of New Users along with time.
* Active Users for checking the amount variance of Active Users along with time.
* Sessions for checking the amount variance of Sessions along with time.
* App Versions for checking the amount variance of New Users, Active Users, Sessions and Session Length of different versions in a certain time zone.

<p class="image-wrapper">
	![newusers](/images/newusers.png)
	
You can check the historical data and developing tread of those data in Trends with Line Charts and Tables.
<br />
The Line Chart is labeled the abscissa with Time and ordinate with Amount Variance along with the time. Clicking the column header can help you sort the records.
<br />
You can choose the time zone for checking by clicking the top right button. Today, Last 7 Days, Last 30 Days, Last 60 Days or even the Customized Rage are all available.
<br />
You can choose the time length in the Line Chart below the date selector, which is classified into Hourly, Daily, Weekly and Monthly. If the time length is longer than the time zone you just selected, this length of time is not selectable. After your selection, the data in Line Chart and Table will be displayed in units.
<br />
Click Compare and choose the end time, it will generate a set of data with the same time length for you to compare. You can compare the development process and trend of the two sets of data in the Line Chart.
<br />
In App Version, you can choose contents to display in Line Chart, such as New Users, Active Users, Sessions or Session Length. You can also choose the version you want to display in the Line Chart.
<br />
#### Retention

<p class="image-wrapper">
	![retention](/images/retention.png)
	
Retention shows the variance of retention rate along with the time from a certain time point. The first row of Retention Table shows the date, the second one shows the amount of New Users and the third one shows the retention rate after a certain time length. Take the daily retention as an example, the 3rd row to 5th row would be the Next Day Retention, Two Days Retention and Three Days Retention. The time can be extended to 30 days.
<br />
Similar to Trends, you can choose the Time Zone and Time Unit on the top right of the Table, including Daily, Weekly and Monthly.
<br />
With retention rate, you can analyze the app attraction towards your users. For example, an app with over 50% retention rate must be an attractive app. You can also analyze if the latest version of your app is trapped in a glitch with the retention rate variance. Take this as an example, the retention rate of version 1.3 is 33% while the rate of version 1.2 was 38%. The 5% must be caused by the adjustment(s) in version 1.3. You can finally figure it out with the error statistics and Custom Event.
<br />
#### Distribution

<p class="image-wrapper">
	![channels](/images/channels.png)
	
Distribution is for you to analyze the Channels. You can check data of each Channel in the Channel page, including New Users, Active Users, Sessions and Session Length. Take Android as an example, you can compare the data of Google Play and Amazon Store, analyze the data traffic in each Channel and strengthen some Channels according to the results.
<br />
Corresponding configuration is needed in the app. Take Android as an example, you need to add following code in manifest:

```java
<application>
    <meta-data
            android:name="las_channel"
            android:value="google_play" />
</application>
```

#### User Engagement
User Engagement is used to describe the Frequency and Session Length. Session Length is how long users stay in your app within a Session, while the Frequency refers to how often users engage in your app.

<p class="image-wrapper">
	![sessionlength](/images/sessionlength.png)
	
There are two parts in Session Length. The first one is each Session Length of all users while the second one is the total Session Length of all users. Those two parts are displayed in Histograms and Tables. The Histogram can show the Session Length straightly with the Session Length as abscissa and Amount as ordinate. The contents in the Table include the Session Length, Session Amount and Proportion of this Session among all Sessions. The Daily Session Length is set by day which means that you can check the total Session Length within one day.

<p class="image-wrapper">
	![frequency](/images/frequency.png)

Frequency is also displayed in Histograms and Tables. The abscissa of histogram represents the range of Session Amount while the ordinate represents the users amount within this range. The Table includes range of Session Amount, User Amount and the Proportion of this kind of users.With data of Frequency, your app can be estimated to be high-frequency or low-frequency app. You can even identify the Session Length and Frequency Type by integrating with Session Length. For example, the musical app would be the high-frequency short-session-length app since users might enter the app to select a song and then put it in background while the weather app would be a low-ferquecny short-session-length app since users would just open it once in the morning to check the daily weather. You can improve and perfect your app by defining its type with User Engagement.

<br />
#### User Actions
User Actions offers you a deep-going way to analyze user behavior with Events, Screen Flow and Funnels.

<p class="image-wrapper">
	![events](/images/events.png)

**Events** refers to certain User Behavior which can be created in Console by clicking Add New Event, filling Event Name, platform and Event Description. You can record an event by invoking following code:  

```objective_c
[LASAnalytics trackEvent:@"Pressed_Cancel_Button"];
```  
<br />
or deliver corresponding parameters of this event while recording: 

```objective_c
[LASAnalytics trackEvent:@"Pressed_Cancel_Button" dimensions:@{@"color":@"red"}];
```

Thus, user behavior of Cancel will be recorded.
<br />
The Event will be available in the Events list after being created in Console or collected from client. You can check the details of this Event in the Detail page by clicking View. The Line Chart will show the amount variance of Event and Users along with time and the Table below would show more details about Events and Users.
<br />
If it is the interface of transferring dimensions that your were invoking when triggering this event, you can check the different keys at the bottom of this page as well as the amount and proportion of values in this key. You can even check the fluctuation of this Event by clicking More.

<p class="image-wrapper">
	![screenflow](/images/screenflow.png)
	

Events can only record one single event of users. If you want to learn more about the procedure, you will need Screen Flow. You need to invoke the following codes to display the Screen Flow in the page：    

```objective_c
- (void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    [LASAnalytics beginLogPageView:@"YourPageName"];
}
```
<br />
and the following codes to hide it in the page: 

```objective_c
- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [LASAnalytics endLogPageView:@"YourPageName"];
}
```

<br />
The "YourPageName" here is the name of page requires recording. The life cycle of a page could be recorded with those two parts of codes. By invoking the code in all pages requires recording and collect and process all the data, you can check the specific data in the Screen Flow page.
<br />
The default start node in **Screen Flow** is Start Session that records the time users open the app. Users may come to different interfaces with different appeals. You can check the proportion of each interface that users would go with figures in Screen Flow. If you click on a page after the Start Session, you would find another flow and proportion with the current page as a start node. The sub-interfaces are all available in this way for you to check the user flow among the pages. If you refuse to set the Start Session as the node, please click Set Root to customize your root node.
<br />
Aside from the Screen Flow diagram at the top of the Screen Flow page, there are two Tables of Occurrence and Exits By Screen.The information in Total Occurrence includes Page Name, Visits, Visit Rate, Session Length and Proportion of Each Length. By figuring out which interface owns the most users and which interface has the longest Sessions, you are able to optimize those pages. Exits By Screen shows the interface where user leaves. It will help you to figure out if they exits because of accomplished missions or minor glitches in this page.
<br />

Funnels refers to a set of user behavior defined by you to check the transfer rate of each session and figure out if there is any problems among all those sessions.
<br />
You can create a new Funnel by clicking Add New Funnel in Funnels page and filling Funnel Name and OS. Then it comes to the most important part: Setup. Please click Add Step, and choose a session to set as the Start Node from the Event List, fill the name of steps below it, add steps you need and click Save, then the Funnel is created.
<br />
You can check the details of this Funnel with a funnel-shaped diagram showing corresponding session names and frequency after the data is collected and processed by the server. You can see the frequency of each session and transfer rate of each progress in the Table below.
<br />
The data in Funnel can help you optimize some typical procedures, like sign up, in-app purchase and etc. Let’s take sign up procedure as an example. Generally speaking, some Apps may show a tutorial before the signup. If you find the churn rate is too high based on the data in Funnels, you should try shortening the sign up procedure by putting tutorial in the back to improve the transfer rate.
<br />
#### Terminal
Terminal contains information of your devices, including Device Models, Resolutions, Firmware Versions, Access, Carriers and Countries. All those information will be displayed in Pie Chart and Table.

<p class="image-wrapper">
	![device](/images/device.png)
	
**Device Models** refer to the model of users’ devices. Take iOS as an example, there might be iPhone 6, iPhone 5, iPad Air, iPad Mini and etc. The vertical axis represents device name while the horizontal axis represents the amount. You can choose New Users or Sessions in Histogram and if you pay attention, you can find the difference in distribution proportion of data and come to the conclusion that the Sessions of New devices will be longer and the old ones will be shorter. The information in the Table concludes device info, amount of new users, percentage of new users among all active users, session amount and the proportion of those sessions.
<br />
Device Models will help you to identify the proportion of each device. For example, if there is a serious bug in iPhone 4S, the first thing you need to do is to evaluate this bug and figure out the proportion of iPhone 4S rather than fixing the bug or disregarding it immediately. The solutions based on 30% and 3% might be totally different.
<br />
**Resolution** becomes complicated among all kinds of devices, and adaptations are always required in old Apps. With Resolution, you can figure out each resolution proportion among all your users and make plans according to the priorities. For example, if 20% of your users are using iPhone 6 Plus and the ratio is about to rise, then you should optimize the iPhone 6 Plus display as soon as possible.
<br />
**Firmware Versions** ratio may change with the release of new operating-system. The ratio of old version will drop continuously, and when it comes to a threshold, you may consider stopping the support for this version.
<br />
**Access** refers to the access to internet which could be divided into the Wi-Fi and mobile network.If the mobile network takes a vast scale, then you should consider optimizing your app to save users’ data traffic.
<br />
**Carriers** will show the device operator, including the name and proportion.
<br />
**Countries** displays top 10 countries with most users in Histogram. You can check in which country your app grows fast with New Users and which country has the most retention and sessions.
<br />
You can find which country have the most potential and make adjustments according to the data, like localization of language, special settings just for this country, etc.
<br />
<br />
<br />
<br />
<br />

