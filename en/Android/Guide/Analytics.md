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

MaxLeap Analytics Service is **Enabled** by default. You can add following code in `onCreate()` in main `Activity` to **disable** it: 

```Java
MLAnalytics.setAnalyticsEnabled(false);
```

## Channel
Channel represents the store users download the app from, like GooglePlay, App Store or other customized sources. You can add following code in AndroidManifest.xml 

```java
<application>
	<meta-data
		android:name="ml_channel"
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
  MLAnalytics.onPause(this);
}
@Override
protected void onResume() {
  super.onResume();
  MLAnalytics.onResume(this);
}
```

* If users go back to the app within a certain time after they left the app, it will be considered as resuming session. The time range can be defined (specified in seconds) by adding following code in `onCreate()` in Main Activity: 
```java
MLAnalytics.setSessionContinueSecond(30)
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
  MLAnalytics.onPageStart(pageName);
}
```

Add following code at the end of the page:

```java
@Override
protected void onPause() {
  super. onPause();
  MLAnalytics.onPageEnd(pageName);
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

Notice that the event_id should be static value, or this may result in a long custom event list and a failure in understanding and analyzing.

### Track the Count of Custom Event

```java
MLAnalytics.logEvent(eventId);
```

### Track Event and Its Property

Invoke following method in the code required tracking: 

```java
MLAnalytics.logEvent(eventId, eventCount, dimensions);
```

## In-app Payment

### Build Transaction

```java
MLIapTransaction transaction = new MLIapTransaction("gas 360", MLIapTransaction.TYPE_IN_APP);
transaction.setTitle("buy gas");
transaction.setDescription("buy some gas to make the car continue running");
transaction.setPriceAmount(7990000);
transaction.setPriceCurrency("GBP");
transaction.setPaySource(MLIapTransaction.PAYSOURCE_GOOGLE_PLAY);
```

Transaction includes the information of a complete purchase event. The constructor receives two parameters: one is `productId` for identifying product and the other is `type` for sorting. It mainly refers to in-app payment and subscription payment.

**Parameter description for Transaction**

Parameter name|Type|Description
---|---|---|---
title|String|Title of the product
description| String |Description of the product
orderId| String |Order ID
priceAmount| long|Price of the product. The value should be a million times more than the actual price according to Google Play.
priceCurrency| String|Monetary unit of the product
paySource| String|The srting of purchase sourse, typically using the defined constant (PAYSOURCE_GOOGLE_PLAY, PAYSOURCE_AMAZON_STORE, PAYSOURCE_ALIPAY, PAYSOURCE_PAYPAL)
virtualCurrencyAmount| String | Virtual Currency Amount only for game payment. It's not required for in-app payment.

### Send Statistical Info

Track the payment event

```java
MLAnalytics.onChargeRequest(transaction);
```

Track the payment success

```java
MLAnalytics.onChargeSuccess(transaction);
```

Track the payment failure

```java
MLAnalytics.onChargeFailed(transaction);
```

Track the payment cancellation

```java
MLAnalytics.onChargeCancel(transaction);
```

**Premise for a Correct Payment Statistics**

1. Integrate Session Statistics

2. Start Payment should be invoked before the success, failure and cancellation to ensure the accuracy of statistics (It should be Start Payment - Payment Failure - Start Payment - Payment Success rather than Start Payment - Payment Failure - Payment Success).

##  Game Statistics

### In-Game Payment

#### Build Transaction

```java
MLIapTransaction transaction = new MLIapTransaction("diamond", MLIapTransaction.TYPE_IN_APP);
transaction.setTitle("buy diamond");
transaction.setDescription("buy some diamond");
transaction.setPriceAmount(7990000);
transaction.setPriceCurrency("GBP");
transaction.setPaySource(MLIapTransaction.PAYSOURCE_GOOGLE_PLAY);
transciation.setVirtualCurrencyAmount(100);
```

Transaction includes the information of a complete purchase event. The constructor receives two parameters: one is `productId` for identifying product and the other is `type` for sorting. It mainly refers to in-app payment and subscription payment.


**Parameter description for Transaction**

Parameter name|Type|Description
---|---|---|---
title|String|Title of the product
description| String |Description of the product
orderId| String |Order ID
priceAmount| long|Price of the product. The value should be a million times more than the actual price according to Google Play.
priceCurrency| String|Monetary unit of the product
paySource| String|The srting of purchase sourse, typically using the defined constant (PAYSOURCE_GOOGLE_PLAY, PAYSOURCE_AMAZON_STORE, PAYSOURCE_ALIPAY, PAYSOURCE_PAYPAL)
virtualCurrencyAmount| String | Virtual Currency Amount only for game payment. It's not required for in-app payment.


#### Send Statistical Info

Track the payment event

```java
MLGameAnalytics.onChargeRequest(transaction);
```

Track the payment success

```java
MLGameAnalytics.onChargeSuccess(transaction);
```

Track the payment failure

```java
MLGameAnalytics.onChargeFailed(transaction);
```

Track the payment cancellation

```java
MLGameAnalytics.onChargeCancel(transaction);
```

Track the system reward

```java
MLGameAnalytics.onChargeSystemReward(transciation, "finish tutorial");
```

**Premise for a Correct Payment Statistics**

1. Integrate Session Statistics

2. Start Payment should be invoked before the success, failure and cancellation to ensure the accuracy of statistics (It should be Start Payment - Payment Failure - Start Payment - Payment Success rather than Start Payment - Payment Failure - Payment Success).

### Purchase and Comsuption of Game Items

Purchase products

```java
MLGameAnalytics.onItemPurchase("sword", "weapon", 1, 100);
```

The parameters are product ID, type, amount and price by order. The instance aforementioned refers to buying a sword weapon with 100 coins. 

Consume products

```java
MLGameAnalytics.onItemUse("Ether", 1);
```

The parameters are product ID and amount by order. The instance aforementioned refers to using one Ether.

Rewards products

```java
MLGameAnalytics.onItemSystemReward("Ether", "medicine", 10, "Open the treasure chest");
```

The parameters are product ID, type, amount and reason by order. The instance aforementioned refers to rewarding players 10 medicine Ether for their opening the treasure chest. 

**Premise for a Correct Product Statistics**

1. Integrate Session Statistics

2. Integrate Level Statistics


### Level Statistics

Start the Mission

```java
MLGameAnalytics.onMissionBegin("mission 1");
```

Parameter is the level ID

Mission failed

```java
MLGameAnalytics.onMissionFailed("mission 1", "hp is 0");
```

The first parameter is level ID and the second one is reason of failure.

Mission completed

```java
MLGameAnalytics.onMissionComplete("mission 1");
```

Parameter is the level ID

Mission paused

```java
 MLGameAnalytics.onMissionPause("mission 1");
```

Parameter is the level ID

Mission restarted

```java
MLGameAnalytics.onMissionResume("mission 1");
```

Parameter is the level ID

**Premise for a Correct Level Statistics**

1. Integrate Session Statistics

2. Start the mission should be invoked before the success, failure, pause and restart to ensure the accuracy of statistics. The level ID should also be consistent.

3. The level should be either successful or failed. It should be Start Mission 1 - Mission 1 failed - Start Mission 2, cross-call like Start Mission 1 - Start Mission 2 is illegal. 
