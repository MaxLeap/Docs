# 分析

## 简介

### 什么是LeapCloud分析服务
LeapCloud分析服务通过客户端及Cloud Data，收集应用及用户的各种数据，并在LeapCloud中进行专业分析，最终生成面向运营者的报表。

### 为何需要LeapCloud分析服务
LeapCloud分析服务是实时、免费、专业的移动应用统计分析服务，它将帮助您全面分析运营状况，深度了解典型用户并优化运营策略。最终实现：

*	**洞察运营概况及趋势**：从产品新增用户、活跃用户、应用启动次数、版本分布，到用户的使用细节、用户属性以及行为特征，你可以洞察到各类数据指标，全面了解产品运营情况和迭代效果。
*	**洞察用户行为**：还原每位用户的使用行为链条，并掌握其活跃度，留存率及转化率。
*	**提升用户体验**：定义用户分群，针对不同用户群体提供个性化体验。
*	**提升应用营收**：跟踪消费行为，制定营销策略，最大化的提升营销效果。


### LeapCloud分析如何工作
“LeapCloud分析”SDK，帮助我们跟踪用户行为，为云端的分析服务提供数据。主要包括：

*  自动收集信息（如终端信息，安装信息等）
*  追踪会话，页面访问
*  追踪自定义事件
*  追踪消费

收集到的数据会被保存至云端，LeapCloud将针对不同时间的数据，对每个用户进行分析，也会将所有用户的数据汇总，进行全局分析。此外，您还可以自定义筛选条件，借助LeapCloud生成相应的分析报表。

## 启用服务
安装SDK完成后，LeapCloud服务将自动帮助您追踪应用内的一些数据。自动收集的数据包括：

1.	终端信息
2.	应用启动和退出
3.	应用崩溃等异常信息

LeapCloud分析服务的默认状态为**开启**，如果您希望**关闭**分析服务，您可以在主`Activity`的`onCreate()`中添加如下代码。

```Java
LCAnalytics.setAnalyticsEnabled(false);
```

## 渠道
渠道代表该应用的来源，如GooglePlay，App Store或其他自定义渠道。只需在AndroidManifest.xml中，添加：

```java
<application>
	<meta-data
		android:name="LC_channel"
		android:value="YOUR_CHANNEL_NAME">
	</meta-data>
</application>
```

##	会话
会话（session）代表在某一段时间内，用户与应用之间的交互。纪录会话，可获取新增用户、活跃用户、启动次数、使用时长等基本数据。
####追踪会话
* 当用户登录时，会话（session）将自动生成。
* 登录后，用户在不同Activity中切换时，我们需要在所有Activity中的`onPause()`和`onResume()`中添加如下代码，以实现会话的暂停和继续，并判断用户是否开始新的会话。(Tips?)

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

* 离开应用后，在特定时间内，用户重返应用，系统将继续上一个会话。该时间长度可自定义（单位：秒）：在主Activity的`onCreate()`函数中添加：

	```java
	LCAnalytics.setSessionContinueSecond(30)
	```
* 当用户注销或离开应用超过特定时间，会话结束。用户重返应用时，将开始新的会话。

## 自定义页面

页面（screen）代表被用户访问的应用界面。纪录页面访问，可获取页面访问量，访问路径，访问深度等数据。

###字段说明

字段名|类型|描述
---|---|---|---
pageName|String|应用页面的名称


###追踪自定义页面
在页面开始处，添加：

```java
@Override
protected void onResume() {
  super.onResume();
  LCAnalytics.onPageStart(pageName);
}
```

在页面结束处，添加：

```java
@Override
protected void onPause() {
  super. onPause();
  LCAnalytics.onPageEnd(pageName);
}
```

注意：

* 每个页面都必须同时指定`onPageStart()`和`onPageEnd()`. 并且，不同页面之间须相互独立，无交叉。
* 若页面通过Activity + Fragment实现，我们需要在Fragment中的`onResume()`和`onPause()`中添加上述代码，以纪录对该Fragment界面的访问。

## 自定义事件

自定义事件可以实现在应用程序中埋点，以纪录用户的点击行为并且采集相应数据。

###字段说明
字段名|类型|描述
---|---|---|---
eventId|String|事件名
key| String |事件参数
value| String|事件参数的值

请注意, 自定义事件名 (event_id) 请尽量保持其为静态值, 否则可能出现数目庞大的自定义事件列表, 而无法达到了解与分析用户行为的目的.

###统计自定义事件发生次数
```java
LCAnalytics.logEvent(eventId);
```

###统计事件及其属性
在您希望跟踪的代码部分，调用如下方法：

```java
LCAnalytics.logEvent(eventId, eventCount, dimensions);
```
