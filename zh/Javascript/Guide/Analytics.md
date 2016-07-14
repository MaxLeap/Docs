# 数据分析

## 简介

### 什么是 MaxLeap 数据分析服务

MaxLeap 数据分析服务通过客户端及 Cloud Data，收集页面及用户的各种数据，并在 MaxLeap 中进行专业分析，最终生成面向运营者的报表。

### 为何需要 MaxLeap 数据分析服务

MaxLeap 数据分析服务是实时、免费、专业的页面统计分析服务，它将帮助您全面分析运营状况，深度了解典型用户并优化运营策略。最终实现：

* **洞察运营概况及趋势**：从产品新增用户、活跃用户、页面打开次数、版本分布，到用户的使用细节、用户属性以及行为特征，你可以洞察到各类数据指标，全面了解产品运营情况和迭代效果。
* **洞察用户行为**：还原每位用户的使用行为链条，并掌握其活跃度，留存率及转化率。
* **提升用户体验**：定义用户分群，针对不同用户群体提供个性化体验。

###  MaxLeap 数据分析如何工作

“MaxLeap 数据分析”SDK，帮助我们跟踪用户行为，为云端的分析服务提供数据。主要包括：

*  自动收集信息（如终端信息）
*  追踪会话，页面访问
*  追踪自定义事件

收集到的数据会被保存至云端，MaxLeap 将针对不同时间的数据，对每个用户进行分析，也会将所有用户的数据汇总，进行全局分析。此外，您还可以自定义筛选条件，借助 MaxLeap 生成相应的分析报表。

## 启用服务

安装 SDK 完成后，MaxLeap 服务将自动帮助您追踪页面内的一些数据，自动收集终端信息。

MaxLeap 分析服务的默认状态为 **开启**，如果您希望 **关闭** 分析服务，您可以在 SDK 初始化中调用以下代码：

```javascript
var options = {
        appId: '56273907169e7d0001bd5c92',
        userId: '571d7d23a5ff7f0001a4f888',
        appVersion: '1.0',
        channel: '360' //可选字段，表示当前页面的渠道
      };
//关闭数据分析服务      
ML.analyticsEnable = false;
var analytics = new ML.Analytics(options);
```

## 页面

页面加载完毕，自动统计用户的页面信息，如 url，referer，os，resolution 等。 

## 自定义事件

自定义事件可以实现在页面中埋点，以记录用户的点击行为并且采集相应数据。

```javascript
var data = {"sex":"man","age":"18"};
analytics.trackEvent('userEvent', data)
```
<!-- 
## 自定义事件2.0

自定义事件2.0可以支持sql检索，从而实现更灵活的数据查询。

```javascript
var data = [{
        "distinct_id": "2b0a6f51a3cd6775",
        "time": 1434556935000,
        "type": "track",
        "event": "ViewProduct",
        "properties": {
          "_manufacturer":"Apple",
          "_model": "iPhone 5",
          "_os":"iOS",
          "_os_version":"7.0",
          "_app_version":"1.3",
          "_wifi":true,
          "_ip":"180.79.35.65",
          "_province":"湖南",
          "_city":"长沙",
          "_screen_width":320,
          "_screen_height":640,
          "product_id":123451231231212,
          "product_name":"苹果",
          "product_classify":"水果",
          "product_price":14.0
        }
      }];
      analytics.trackOriginEvent(data);
```

其中，下划线字段是系统预定义字段，其他字段为用户自定义字段。
-->

## 用户使用轨迹

记录用户从注册开始到退出的整个时间段内，用户所有相关使用详情，您可以深度分析某个用户行为轨迹。
分析用户使用轨迹的前提，是用户使用了 MaxLeap 的账号系统，并在初始化 MaxLeap 分析服务时传入了正确的 userId。

### 用户注册

记录用户注册时相关信息

```javascript
var data = {
	eventId: 'registereventid',
	eventName: 'registereventname',
	eventNickName: 'registereventnickname'
};
analytics.trackUserRegister(data)
```

### 用户登录

记录用户登录时相关信息

```javascript
var data = {
	eventId: 'logineventid',
	eventName: 'logineventname',
	eventNickName: 'logineventnickname'
};
analytics.trackUserlogin(data)
```

### 用户注销

记录用户注册时相关信息

```javascript
var data = {
	eventId: 'logouteventid',
	eventName: 'logouteventname',
	eventNickName: 'logouteventnickname'
};
analytics.trackUserLogout(data)
```

### 会话开始

记录用户会话开始相关信息

```javascript
var data = {
	eventId: 'sessionstartid',
	eventName: 'sessionstartname',
	eventNickName: 'sessionstartnickname'
};
analytics.trackSessionStart(data)
```


