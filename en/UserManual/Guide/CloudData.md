## Push Notification
####introduction
Push Notification is a push system powered by the notification system in your cell phone. In LAS, you can easily edit the content and send it to a certain group of people.

<p class="image-wrapper">
    ![Push Notification](/images/push.png?raw=true)

<br />
#### send push notification
Click the Push Notification in Dashboard or Menu and click Send New Push, then you can set up the message we want to send.
<br />
Firstly, you need to name your Push Campaign which could clearly clarify the aim of your Push Campaign, such as Special Offer for Pro Upgrading, Redeem Precious Users, etc.
<br />
The next setup is for Sending Time and Expiration Time. You can choose Now if you want to send it right now. Otherwise, you can choose a certain time point for sending, such as the zero o’clock of the January 1st.
<br />
The Expiration Time is for you to set a certain time to expire the message. In certain circumstances, like the overload of data or an error in Apple server, part of your Push Notifications haven’t been handled in time. If the time limit exceeded, the system will not send it again. There are three kinds of expiration date for you to choose: Never, Specific Time and After Interval. Never means it'll never expire Push Notification. Specific Time refers to expiring Push Notification at a specific time point While the After Internal refers to expiring Push Notification after a certain time length from the time you sent it.
<br />
Here it comes to the receiver. The receiver includes Everyone, Devices and Segment. Everyone, of course, refers to notifications for all.
<br />
In Devices, you can send Push Notification to certain users with settings on Channel, Language, Locale and Installation Date. Channel is used to filter certain stores, like App Store and Google Play. Language is used to set the default language in devices. Locale refers to the region while Installation Date is for filtering users according to the date they installed the app (before/after a time point or during a time zone).
<br />
In Segment, you can send Push Notification to a certain Segment of users you set before. Please check Introduction To Segment to find out how to create and use Segment.
<br />
Then it comes to the device selection for Push Notification. Single and multiple selection between iOS and Android are all available for you. The preview interface of Push Notification below the page will vary based on the platform(s) you choose.
<br />
The last thing is push notificaiton itself. There are two kinds of edit pattern for you, Text or JSON. You can just enter the message in the text box in Text pattern while you can deliver some extra information in JSON pattern to make certain responses to .
<br />
At last, you can send the well-done Push Notification by clicking Send Push.
#### manage push campaign
Enter Push Campaigns management page by tapping Push Campaigns in the left Menu bar, and you can check Push Campaigns lists you added for your app. The information in the list includes:

* Date, the exact time you create this Push Campaign.
* Target Type, the type you choose to send, including Everyone, Devices and Segment.
* Subscribers, the amount of your subscribers.
* Campaign Name, the name for your Push Campaign.
* Status, the delivery status of this Push Notification.
* Percentage, the delivery status of this Push Campaign, including Sent, Unsent, Devices and Segment.
* Details, click on the View button and then you can check the details of this Push Campaign.

<br />
The Status includes:

* INIT, mission initializing
* SCHEDULE, mission scheduled (can be deleted)
* DONE, mission done
* TODO, mission in progress
* Expire, mission overdue (Part of them been sent)
* ABORT, mission canceled (only available for TODO and INIT)

<br />
By clicking into the detail page of Push Campaign, you can check the information in detail, including the Preview Page in cell phone, the Content of your Data, Creation Date, Update Date, Expiration Date, Expiration Type, Campaign Name, Status, Push Time, Error Info and Sending Status. The error message refers to the message you got when the Push Notification failed to be sent which will help you spot the glitch. The Sending Status list includes the amount of succeed, failed and unsent.<br />
<br />
<br />
<br />
<br />
<br />



