# 数据分析

## 简介

### 什么是 MaxLeap 数据分析服务

MaxLeap 数据分析服务通过客户端及 Cloud Data，收集应用及用户的各种数据，并在 MaxLeap 中进行专业分析，最终生成面向运营者的报表。

### 为何需要 MaxLeap 数据分析服务

MaxLeap 数据分析服务是实时、免费、专业的移动应用统计分析服务，它将帮助您全面分析运营状况，深度了解典型用户并优化运营策略。最终实现：

* **洞察运营概况及趋势**：从产品新增用户、活跃用户、应用启动次数、版本分布，到用户的使用细节、用户属性以及行为特征，你可以洞察到各类数据指标，全面了解产品运营情况和迭代效果。
* **洞察用户行为**：还原每位用户的使用行为链条，并掌握其活跃度，留存率及转化率。
* **提升用户体验**：定义用户分群，针对不同用户群体提供个性化体验。
* **提升应用营收**：跟踪消费行为，制定营销策略，最大化的提升营销效果。


###  MaxLeap 数据分析如何工作

“MaxLeap 数据分析”SDK，帮助我们跟踪用户行为，为云端的分析服务提供数据。主要包括：

*  自动收集信息（如终端信息，安装信息等）
*  追踪会话，页面访问
*  追踪自定义事件
*  追踪消费

收集到的数据会被保存至云端，MaxLeap 将针对不同时间的数据，对每个用户进行分析，也会将所有用户的数据汇总，进行全局分析。此外，您还可以自定义筛选条件，借助 MaxLeap 生成相应的分析报表。

## 启用服务

安装 SDK 完成后，MaxLeap 服务将自动帮助您追踪应用内的一些数据，自动收集终端信息。

MaxLeap 分析服务的默认状态为 **开启**，如果您希望 **关闭** 分析服务，您可以在 SDK 初始化中调用以下代码：

```Java
MaxLeap.Options options = new MaxLeap.Options();
options.appId = APP_ID;
options.clientKey = API_KEY;
//	关闭数据分析
options.analyticsEnable = false;
MaxLeap.initialize(this, options);
```

## 渠道

渠道代表该应用的来源，如 GooglePlay，App Store 或其他自定义渠道。如果分析服务是开启的，则必须先设置渠道。只需在 `AndroidManifest.xml` 中添加如下代码：

```java
<application>
	<meta-data
		android:name="ml_channel"
		android:value="YOUR_CHANNEL_NAME">
	</meta-data>
</application>
```


##	会话

会话（session）代表在某一段时间内，用户与应用之间的交互。记录会话可获取新增用户、活跃用户、启动次数、使用时长等基本数据。

### 追踪会话

* 用户在不同 Activity 中切换时，我们需要在所有 Activity 中的 `onPause()` 和 `onResume()` 中添加如下代码，以实现会话的暂停和继续，并判断用户是否开始新的会话。

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

* 离开应用后，在特定时间内，用户重返应用，系统将继续上一个会话。该时间长度可自定义（单位：秒），在 SDK 初始化时调用以下代码：

```java
options.sessionContinueTime = 30 * 1000;
```

* 当应用进入后台超过特定时间，会话结束。用户重返应用时，将开始新的会话。

## 自定义页面

页面（screen）代表被用户访问的应用界面。记录页面访问可获取页面访问量，访问路径，访问深度等数据。

### 字段说明

字段名|类型|描述
---|---|---|---
pageName|String|应用页面的名称


### 追踪自定义页面
在页面开始处，添加：

```java
@Override
protected void onResume() {
  super.onResume();
  MLAnalytics.onPageStart(pageName);
}
```

在页面结束处，添加：

```java
@Override
protected void onPause() {
  super. onPause();
  MLAnalytics.onPageEnd(pageName);
}
```

注意：

* 每个页面都必须同时指定`onPageStart()`和`onPageEnd()`，并且不同页面之间须相互独立，没有交叉，即不能 `start page 1-start page 2-end page 1-end page 2`。
* 若页面通过 Activity + Fragment 实现，我们需要在 Fragment 中的`onResume()`和`onPause()`中添加上述代码，以记录对该 Fragment 界面的访问。

## 自动统计会话和页面

自动统计可以省去手动调用的繁琐步骤，但是自动统计仅适用于 4.0 以上的设备，所以如果你的应用需要兼容 4.0 以下的设备时不应该使用自动统计，而应该按照前两节的所述进行手动统计。

自动统计默认关闭，可以通过以下代码开启自动统计

自动统计会话和页面

```java
options.autoTrackStrategy = MaxLeap.AUTO_TRACK_SESSION_AND_PAGEVIEW;
```

仅自动统计会话

```java
options.autoTrackStrategy = MaxLeap.AUTO_TRACK_SESSION;
```

## 自定义事件

自定义事件可以实现在应用程序中埋点，以记录用户的点击行为并且采集相应数据。

### 字段说明

字段名|类型|描述
---|---|---|---
eventId|String|事件名
key| String |事件参数
value| String|事件参数的值

请注意不要定义过多的自定义事件名 (event_id) 否则可能出现数目庞大的自定义事件列表, 而无法达到了解与分析用户行为的目的.

### 统计自定义事件发生次数

```java
MLAnalytics.logEvent(eventId);
```

### 统计事件及其属性

如果你希望统计事件时包含自定义的属性可以调用如下方法：

```java
Map<String,String> dimensions = new HashMap<>;
dimensions.put("error", "404");
MLAnalytics.logEvent(eventId, eventCount, dimensions);
```

## 应用内支付

应用内支付用于统计用户的支付行为。

### 建立 Transaction

```java
MLIapTransaction transaction = new MLIapTransaction("gas 360", MLIapTransaction.TYPE_IN_APP);
transaction.setTitle("buy gas");
transaction.setDescription("buy some gas to make the car continue running");
transaction.setPriceAmount(7990000);
transaction.setPriceCurrency("GBP");
transaction.setPaySource(MLIapTransaction.PAYSOURCE_GOOGLE_PLAY);
```

Transaction 用于表示一次完整的购买行为所相关的信息。其构造方法接收两个参数：`productId` 和 `type`，`productId` 用于区分物品，`type` 为物品的类型，通常为应用内付费或者订阅付费两种。

**Transaction 的属性说明**

属性名|类型|描述
---|---|---|---
title|String|购买的物品的标题
description| String |购买的物品的描述信息
orderId| String |订单 ID
priceAmount| long|购买的物品的价格，根据 Google Play 的定义，其值为实际价格的 100 万倍
priceCurrency| String|购买的物品的货币单位
paySource| String|表示购买的渠道的字符串，通常使用系统已定义的常量即可（PAYSOURCE_GOOGLE_PLAY, PAYSOURCE_AMAZON_STORE, PAYSOURCE_ALIPAY, PAYSOURCE_PAYPAL）
virtualCurrencyAmount| String | 虚拟货币价格，仅用于游戏支付，应用内付费不需要设置该属性

### 发送统计信息

统计表示开始支付的事件

```java
MLAnalytics.onChargeRequest(transaction);
```

统计表示支付成功的事件

```java
MLAnalytics.onChargeSuccess(transaction);
```

统计表示支付失败的事件

```java
MLAnalytics.onChargeFailed(transaction);
```

统计表示支付取消的事件

```java
MLAnalytics.onChargeCancel(transaction);
```

**正确统计支付信息前提**

1. 集成 Session 统计信息

2. 调用成功，失败或取消事件前必须先调用开始支付才能保证统计的数据的正确性（即开始支付-支付失败-开始支付-支付成功，而不能开始支付-支付失败-支付成功）

##  游戏统计

游戏统计用于统计用户的游戏内行为，包括游戏内付费，进入关卡，购买物品等。

### 游戏内付费

#### 建立 Transaction

```java
MLIapTransaction transaction = new MLIapTransaction("diamond", MLIapTransaction.TYPE_IN_APP);
transaction.setTitle("buy diamond");
transaction.setDescription("buy some diamond");
transaction.setPriceAmount(7990000);
transaction.setPriceCurrency("GBP");
transaction.setPaySource(MLIapTransaction.PAYSOURCE_GOOGLE_PLAY);
transciation.setVirtualCurrencyAmount(100);
```

Transaction 用于表示一次完整的购买行为所相关的信息。其构造方法接收两个参数：`productId` 和 `type`，`productId` 用于区分物品，`type` 为物品的类型，通常为应用内付费或者订阅付费两种。

**Transaction 的属性说明**

属性名|类型|描述
---|---|---|---
title|String|购买的物品的标题
description| String |购买的物品的描述信息
orderId| String |订单 ID
priceAmount| long|购买的物品的价格，根据 Google Play 的定义，其值为实际价格的 100 万倍
priceCurrency| String|购买的物品的货币单位
paySource| String|表示购买的渠道的字符串，通常使用系统已定义的常量即可（PAYSOURCE_GOOGLE_PLAY, PAYSOURCE_AMAZON_STORE, PAYSOURCE_ALIPAY, PAYSOURCE_PAYPAL）
virtualCurrencyAmount| String | 虚拟货币价格，仅用于游戏支付，应用内付费不需要设置该属性


#### 发送统计信息

统计表示开始支付的事件

```java
MLGameAnalytics.onChargeRequest(transaction);
```

统计表示支付成功的事件

```java
MLGameAnalytics.onChargeSuccess(transaction);
```

统计表示支付失败的事件

```java
MLGameAnalytics.onChargeFailed(transaction);
```

统计表示支付取消的事件

```java
MLGameAnalytics.onChargeCancel(transaction);
```

统计表示系统赠送的事件

```java
MLGameAnalytics.onChargeSystemReward(transciation, "finish tutorial");
```

**正确统计支付信息前提**

1. 集成 Session 统计信息

2. 调用成功，失败或取消事件前必须先调用开始支付才能保证统计的数据的正确性（即开始支付-支付失败-开始支付-支付成功，而不能开始支付-支付失败-支付成功）

### 游戏内物品的购买与消费

购买物品

```java
MLGameAnalytics.onItemPurchase("sword", "weapon", 1, 100);
```

参数依次为 物品 ID，物品类型，购买数量，虚拟货币数量，即以上例子表示使用100个虚拟货币购买一把类型为武器的剑。

消耗物品

```java
MLGameAnalytics.onItemUse("Ether", 1);
```

参数依次为 物品 ID，使用数量，即以上例子表示使用1个以太。

系统赠送物品

```java
MLGameAnalytics.onItemSystemReward("Ether", "medicine", 10, "Open the treasure chest");
```

参数依次为 物品 ID，物品类型，赠送数量，赠送原因，即以上例子表示系统因为玩家打开了宝箱赠送给玩家10瓶类型为药剂的以太。

**正确统计物品信息前提**

1. 集成 Session 统计信息

2. 集成关卡统计信息


### 关卡统计

关卡开始

```java
MLGameAnalytics.onMissionBegin("mission 1");
```

参数为关卡 ID

通关失败

```java
MLGameAnalytics.onMissionFailed("mission 1", "hp is 0");
```

第一个参数为关卡 ID，第二个参数为失败原因。

通关成功

```java
MLGameAnalytics.onMissionComplete("mission 1");
```

参数为关卡 ID

关卡暂停

```java
 MLGameAnalytics.onMissionPause("mission 1");
```

参数为关卡 ID

关卡重开

```java
MLGameAnalytics.onMissionResume("mission 1");
```

参数为关卡 ID

**正确统计关卡信息前提**

1. 集成 Session 统计信息

2. 调用成功，失败，暂停或重开事件前必须先调用关卡开始才能保证统计的数据的正确性，且关卡 ID 必须一致。

3. 关卡开始后要么失败要么成功，不允许交叉调用，即开始关卡1-开始关卡2是非法的调用，必须开始关卡1-关卡1结束-开始关卡2。





