## Segments
#### introduction
Segments refers to smaller subgroups, which are divided based on the same features or behaviors. You can make data analysis towards a certain Segment, send push notifications or even change the in-app user behavior according to your requirements with Cloud Config. Segments offers multiple functions for you to explore, for example:
<br />

* Check how many time the paying users use your app each day;
* Send Merry Christmas to American users on Dec 25 or send Happy New Year to Chinese users on Spring Festival;
* Check if the retention rate is rising after the optimization towards iPhone 6 Plus.

<p class="image-wrapper">
	![Segment](/images/segment.png?raw=true)

<br />
Here are the details on how to use Segments.
<br />
#### Create a Segment
You can start using Segments after clicking the Segments on Dashboard or Services. Since first is first, you need to create a Segment by clicking the Create Segment, then you will enter the Segment Settings page.
<br />
Firstly, you need to name your Segment with a distinctive title, like American Users with iPhone 6 Plus, Users with Pro, etc. Therefore, you can easily spot the Segment from all Segments if there are some operations to be performed.
<br />
You need to add features for your Segment after you named it, the features can be summarized as follows:

* User Info
* Device Info
* Usage
* Events
* Payment

<br />
You can choose one or more features from those five and the relationship between those features is “And” which means the users can only be added to this segment with all features satisfied. Now let me explain those five features to you in detail.
<br />
###### User Info
User info includes two settings, Country and Language. You can limit the users into a small group with those two limitations. For example, if you set the Country as United States and the Language as Spanish, this segment will only contains Spanish-speaking users in United Stated.
<br />
###### Device Info
Device Info is the qualified settings towards devices, including Device Type, Channel and App Version. Device Type is used to differentiate platforms, like iOS and Android. Channel refers to where your users get this app, like App Store and Google Play. App Version is easy to understand. A Segment can be created with those info, like Version 2.0 on iOS.
<br />
###### Usage
Usage can be divided into five types based on how often users use this app.

* Heavy, over 14 times in past 7 days.
* Regular, 7 to 14 times in past 7 days.
* Low, 2 to 7 times in past 7 days.
* Infrequent, once in past 7 days.
* Lost, never in past 7 days.

<br />
You can make specific plans towards different segments according to those five types. For example, you can setup Cloud Config for the Heavy and recommend new functions for them while send Push Notifications to the Lost and bring them back to your app.
<br />
###### Events
Events refers to the specific events created with LAS SDK. Segments can be created with one or more triggers. If you are not familiar with Events, please check Introduction To Analytics for more details.
<br />
The Events can be divided into two parts, with or without triggering the event(s).
<br />
The first part can be set as triggering one event or more while the relationship between those multiple events can be And or Or. And means users will be added to this segment if all events happened while the Or means once one of them happened, the users will be added to Segment.
<br />
In second part, you can create segment without event(s) triggered. With multiple events chosen, you can create a segment with all events not happening.

<br>
With those settings, you can create numerous special Segments, such as Unregistered Users with 100 fav songs in a music app, Users with Full Shopping Cart and Little Settlement in a shopping app.
<br >
###### Payment
Payment is divided according to the in-app payment level. The default three types are

* Heavy, paid over $50
* Regular, paid $5 to $50
* Low, paid less than $5

<br />
According to those settings, you can filter premium users and treat them with special methods with Push notifications and Cloud Config.
<br />
###### Use in Analytics
Aside from the five Settings we just mentioned, you can decide whether to add this Segment to Analytics or not at the end of the creation. In this way, you are able to check the statistical data of this segment in Analytics after a period of processing.
<br />
#### usage of segments
For Usage of Segments in Analytics, please check Introduction To [Analytics](../../docs/appAnalytics/index.html).
<br />
For Usage of Segments in Cloud Config, please check Introduction To [Cloud Config](../../docs/cloudConfig/index.html).
<br />
For Usage of Segments in Push, please check Introduction To [Push](../../docs/pushNotifications/index.html).
<br />
<br />
<br />
<br />
<br />
